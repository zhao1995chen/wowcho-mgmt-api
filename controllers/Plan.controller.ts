import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Plan } from '../models/Plan.model'
import { IPlan } from '../interfaces/Plan.interface'
import { Proposal } from '../models/Proposal.model'
import { Types } from 'mongoose'
import { ERROR } from '../const'

export const PlanController = {
  // 新增方案 
  async create(req: Request, res: Response) {
    try {
      const url = req.body.proposalUrl
      const newPlan:IPlan = new Plan({
        ...req.body,
        _id: new Types.ObjectId(),
      })
      // 驗證資料
      const validateError = newPlan.validateSync()
      if (validateError) throw validateError

      // 確認原價是否有值，有值才做驗證
      if(newPlan.originalPrice) {
        // 折扣價若大於原價
        if(newPlan.actualPrice > newPlan.originalPrice ) throw { message: '募資方案折扣價格不可大於原始價格' }
      }

      // 尋找募資專案是否存在
      const checkProposal = await PlanController.checkProposal(url)
        .catch(()=>{
          throw {  message:ERROR.GENERAL }
        })
      // 若不存在跳錯
      if (!checkProposal) throw { fieldName: '募資活動', message: ERROR.INVALID }

      // 驗證都通過，儲存新增 plan 至資料庫
      const savedPlan = await newPlan.save()
      // 將 id push 至 Proposal
      await checkProposal.pushPlan(savedPlan._id)
      successHandler(res,savedPlan)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 編輯
  async update(req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      // 確認募資活動、募資方案 id
      const checkId = PlanController.checkId(req.body)
      if(checkId) throw checkId
      // 找符合 募資活動、募資方案 id
      const { id, proposalUrl, image, name, summary, originalPrice, actualPrice, quantity, nowBuyers, pickupDate, toSponsor, specification, freightMainIsland, freightOuterIsland, freightOtherCountries } = req.body 
      const userPlan = { proposalUrl, image, name, summary, originalPrice, actualPrice, quantity, nowBuyers, pickupDate, toSponsor, specification, freightMainIsland, freightOuterIsland, freightOtherCountries }
      
      // 確認原價是否有值，有值才做驗證
      if(originalPrice) {
        // 折扣價若大於原價
        if(actualPrice > originalPrice ) throw { message: '募資方案折扣價格不可大於原始價格' }
      }
      const plan = await Plan.findOneAndUpdate(
        { _id:id, proposalUrl },
        userPlan,
        {
          new: true, // 返回更新後的文檔
          upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
          runValidators: true, // 觸發 Schema 驗證
        }
      ).catch(()=>{
        throw { fieldName: '募資方案', message: ERROR.INVALID }
      })
      if (!plan) throw { fieldName: '募資方案', message: ERROR.INVALID }
      successHandler(res, plan)

    } catch(e){
      errorHandler(res, e)
    }
  },
  // 獲得方案列表
  async getList(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const proposalUrl = req.query.proposalUrl // 募資活動 id
      if (!proposalUrl) throw { fieldName: '募資活動', message: ERROR.INVALID }

      const planList = await Plan.find({ proposalUrl })
        .select('_id proposalUrl image name summary actualPrice originalPrice quantity nowBuyers pickupDate')
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .catch(() => {
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        })
      const totalCount = await Plan.countDocuments({ proposalUrl })
      const data = {
        list: planList,
        totalCount:totalCount
      }
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得方案詳細
  async get(req: Request, res: Response) {
    try {
      // 確認募資活動、募資方案 id
      const checkId = PlanController.checkId(req.query)
      if(checkId) throw checkId
      // 找符合 募資活動、募資方案 id
      const plan = await Plan.findOne({ _id:req.query.id, proposalUrl: req.query.proposalUrl })
        .catch(()=>{
          throw { fieldName: '募資方案', message: ERROR.INVALID }
        })
      // 募資方案 id、 募資活動 id 必須存在
      if (!plan) throw { fieldName: '募資方案', message: ERROR.INVALID }

      successHandler(res, plan)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得方案規格
  async getSpecification(req: Request, res: Response) {
    try {
      // 確認募資活動、募資方案 id
      const checkId = PlanController.checkId(req.query)
      if(checkId) throw checkId
      // 找符合 募資活動、募資方案 id
      const plan = await Plan.findOne({ _id:req.query.id, proposalUrl: req.query.proposalUrl })
        .select('specification')
        .catch(()=>{
          throw { fieldName: '募資方案', message: ERROR.INVALID }
        })
      if (!plan) throw { fieldName: '募資方案', message: ERROR.INVALID }

      successHandler(res, plan)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 刪除
  async delete (req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      console.log(req.body)
      // 檢查所有文檔是否存在
      const proposalUrl = req.body.proposalUrl
      const planArray = req.body.id
      // 確認資料庫是否有刪除 id
      const planList = await Plan.find({ _id: { $in: planArray } })
        .catch(() => {
          throw { fieldName: '募資方案', message: ERROR.INVALID }
        })
      if (!planList) throw { fieldName: '募資方案', message: ERROR.INVALID }
      const proposal = await Proposal.findOne({ customizedUrl: proposalUrl })
        .catch(() => {
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        })
      if (!proposal) throw { fieldName: '募資活動', message: ERROR.INVALID }

      // 刪除募資方案資料
      proposal.removePlan(planArray)
      // 刪除方案
      await Plan.deleteMany({ _id: { $in: planArray } })
      // 刪除活動中方案 id 
      await proposal.save()
      // splice
      successHandler(res)
    } catch(e){
      errorHandler(res, e)
    }
  },
  async checkProposal(url:string) {
    const proposal = await Proposal.findOne({ customizedUrl:url })
    return proposal
  },

  checkId(value) {
    const { proposalUrl = '', id = '' } = value
    if (proposalUrl.length === 0) return { fieldName: '募資活動', message: ERROR.INVALID }
    if (id.length === 0) return { fieldName: '募資方案', message: ERROR.INVALID }
    return
  }

}