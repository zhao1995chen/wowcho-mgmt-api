import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Proposal } from '../models/Proposal.model'
import { IProposal } from '../interfaces/Proposal.interface'
import { ERROR } from '../const'

export const ProposalController = {
  // 新增
  async create(req: Request, res: Response) {
    try {
      // middleware 帶來 id 轉換成指定 key
      req.body.ownerId = req.body._id
      delete req.body._id
      const newProposal:IProposal = new Proposal(req.body)
      // 驗證資料
      const validateError = newProposal.validateSync()
      if (validateError) throw validateError

      // 募資活動網址重複
      const duplicate = await ProposalController.createDuplicate(newProposal)
      if (duplicate) throw duplicate

      // 檢查開始時間、結束時間
      const overTime = ProposalController.overTime(newProposal)
      if (overTime) throw overTime

      // 創建募資活動
      const proposal = await Proposal.create(newProposal)
      successHandler(res,proposal)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async createDuplicate(value: IProposal) {
    const { customizedUrl } = value
    if (await Proposal.exists({ customizedUrl })) return { fieldName: '專案網址', message: ERROR.DUPLICATE }
    return
  },
  // 編輯
  async update(req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      const { id = '', ownerId, image, video, name, category, summary, description, targetPrice, nowPrice, nowBuyers, startTime, endTime, ageLimit, customizedUrl, status, content, planIdList, messageIdList, faqIdList, promiseId } =  req.body 
      const userProposal = { ownerId, image, video, name, category, summary, description, targetPrice, nowPrice, nowBuyers, startTime, endTime, ageLimit, customizedUrl, status, content, planIdList, messageIdList, faqIdList, promiseId }
      // 確認是否無 id
      const haveId = ProposalController.haveId(id)
      if(haveId) throw haveId
      // 募資活動網址重複
      const updateDuplicate = await ProposalController.updateDuplicate(customizedUrl,id)
        .catch(() => { 
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        }) 
      if (updateDuplicate) throw updateDuplicate
      
      // 檢查開始時間、結束時間
      const overTime = ProposalController.overTime(userProposal)
      if (overTime) throw overTime
      // 檢查是否有該資料
      const proposal = await Proposal.findByIdAndUpdate<IProposal>(id, userProposal, {
        new: true, // 返回更新後的文檔
        upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
        runValidators: true, // 觸發 Schema 驗證
      })
      if (!proposal) throw  { fieldName: '募資活動', message: ERROR.INVALID }

      successHandler(res, proposal)
    } catch(e){
      errorHandler(res, e)
    }
  },
  haveId(id:string) {
    if (id.length === 0) {
      return { message: ERROR.GENERAL }
    }
    return
  },
  // 檢查重複，同募資提案，網址可維持一致
  async updateDuplicate(customizedUrl, id: string) {
    const check = await Proposal.findOne({
      customizedUrl,
      _id: { $ne: id }, // 確保找到的文檔不是當前文檔
    })

    if (check) return { fieldName: '專案網址', message: ERROR.DUPLICATE }
    return
  },

  // 獲得列表
  async getList(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const proposalList = await Proposal.find({ ownerId: req.body._id })
        .select('_id image name customizedUrl category summary targetPrice nowPrice nowBuyers startTime endTime updatedAt createdAt')
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
      const totalCount = await Proposal.countDocuments({ ownerId: req.body._id })
      const data = {
        list: proposalList,
        totalCount:totalCount
      }
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得詳細資訊
  async get(req: Request, res: Response) {
    try {
      const id = req.query.id // 指定 proposal id
      const proposal = await Proposal.findOne<IProposal>({ _id:id })
        .catch(() => {
          throw  { fieldName: '募資活動', message: ERROR.INVALID }
        })
      if (!proposal) throw  { fieldName: '募資活動', message: ERROR.INVALID }
      // 資料擁有者 和 JWT 使用者不匹配
      if (proposal.ownerId.toString() !== req.body._id) throw { message: ERROR.PERMISSION_DENIED }
      successHandler(res, proposal)
    }
    catch(e) {
      errorHandler(res, e)
    }
  },

  // 刪除
  async delete (req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      // 檢查回傳回來刪除 id
      const arrayId = req.body.id
      const checkArrayId = ProposalController.checkArrayId(arrayId)
      if(checkArrayId) throw checkArrayId
      // 確認資料庫是否有刪除 id
      const proposalList = await Proposal.find({ _id: { $in: arrayId } })
        .catch(() => {
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        })
      if (!proposalList) throw { fieldName: '募資活動', message: ERROR.INVALID }
      // 刪除資料
      await Proposal.deleteMany({ _id: { $in: arrayId } })
      successHandler(res)
    } catch(e){
      errorHandler(res, e)
    }
  },
  checkArrayId(arrayId = []) {
    if (arrayId.length === 0) {
      return { message: ERROR.GENERAL }
    }
    return
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
  overTime(value) {
    const { startTime, endTime } = value
    if ( endTime !== null ) {
      // 開始時間 >= 結束時間
      if ( startTime >= endTime ) {
        return { message: '活動起始時間不可晚於活動結束時間' }
      }
      return 
    }
    // 若是 null 直接通過 
    return
  }
}