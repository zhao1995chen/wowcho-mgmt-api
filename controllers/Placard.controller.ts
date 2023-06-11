import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Placard } from '../models/Placard.model'
import { IPlacard } from '../interfaces/Placard.interface'
import { Proposal } from '../models/Proposal.model'
import { Types } from 'mongoose'
import { ERROR } from '../const'

export const PlacardController = {
  // 獲得詳細
  async get(req: Request, res: Response) {
    try {
      // 確認募資活動、募資進度 id
      const checkId = PlacardController.checkId(req.query)
      if(checkId) throw checkId
      // 找符合 募資活動、募資進度 id
      const placard = await Placard.findOne({ _id:req.query.id, customizedUrl: req.query.customizedUrl })
        .catch(()=>{
          throw { fieldName: '募資進度', message: ERROR.INVALID }
        })
      // 募資進度 id、 募資活動 id 必須存在
      if (!placard) throw { fieldName: '募資進度', message: ERROR.INVALID }

      successHandler(res, placard)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得列表
  async getList(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const customizedUrl = req.query.customizedUrl // 募資活動 id
      if (!customizedUrl) throw { fieldName: '募資活動', message: ERROR.INVALID }
      const PlacardList = await Placard.find({ customizedUrl: customizedUrl })
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .catch(() => {
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        })
      const totalCount = await Placard.countDocuments({ customizedUrl })
      const data = {
        list: PlacardList,
        totalCount:totalCount
      }
      successHandler(res,data)
    } catch (error) {
      errorHandler(res, error)
    }
  },
  // 新增
  async create(req: Request, res: Response) {
    try {
      const url = req.body.customizedUrl
      const newPlacard:IPlacard = new Placard({
        ...req.body,
        _id: new Types.ObjectId(),
      })
      // 驗證資料
      const validateError = newPlacard.validateSync()
      if (validateError) throw { validateMessage: validateError, type: 'validate' }
      // 尋找募資專案是否存在
      const proposal = await Proposal.findOne({ customizedUrl:url })
        .catch(()=>{
          throw {  message:ERROR.GENERAL }
        })
      // 若不存在跳錯
      if (!proposal) throw { fieldName: '募資活動', message: ERROR.INVALID }
      // 驗證都通過，儲存新增 plan 至資料庫
      const savePlacard = await newPlacard.save()
      await proposal.pushFaq(savePlacard._id)
      successHandler(res, savePlacard)
    }  catch (error) {
      errorHandler(res, error)
    }
  },
  // 編輯
  async update(req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      // 確認募資活動、募資方案 id
      const checkId = PlacardController.checkId(req.body)
      if(checkId) throw checkId
      const { id, customizedUrl, title, date, content } = req.body 
      const userPlacard = { id, customizedUrl, title, date, content }
      const placard = await Placard.findOneAndUpdate(
        { _id:id, customizedUrl },
        userPlacard,
        {
          new: true, // 返回更新後的文檔
          upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
          runValidators: true, // 觸發 Schema 驗證
        }
      ).catch((e)=>{
        throw { validateMessage: e, type: 'validate' }
      })
      if (!placard) throw { fieldName: '常見問答', message: ERROR.INVALID }
      successHandler(res,placard)
    } catch (error) {
      errorHandler(res, error)
    }
  },
  // 刪除
  async delete(req: Request, res: Response) {
    try {
      if (!req.body) throw { message: ERROR.GENERAL }
      // 檢查所有文檔是否存在
      const customizedUrl = req.body.customizedUrl
      const placardArray = req.body.id
      // 確認資料庫是否有刪除 id
      const PlacardList = await Placard.find({ _id: { $in: placardArray } })
        .catch(() => {
          throw { fieldName: '專案進度', message: ERROR.INVALID }
        })
      if (!PlacardList) throw { fieldName: '專案進度', message: ERROR.INVALID }
      const proposal = await Proposal.findOne({ customizedUrl: customizedUrl })
        .catch(() => {
          throw { fieldName: '募資活動', message: ERROR.INVALID }
        })
      if (!proposal) throw { fieldName: '募資活動', message: ERROR.INVALID }

      // 刪除募資活動中，方案關聯資料
      await proposal.removeFaq(placardArray)
      // 刪除資料庫中方案資料
      // 刪除活動中方案 id 
      // await proposal.save()
      await Placard.deleteMany({ _id: { $in: placardArray } })
      // splice
      successHandler(res)
    } catch(e){
      errorHandler(res, e)
    }
  },
  checkId(value) {
    const { customizedUrl = '', id = '' } = value
    if (customizedUrl.length === 0) return { fieldName: '募資活動', message: ERROR.INVALID }
    if (id.length === 0) return { fieldName: '常見問答', message: ERROR.INVALID }
    return
  }
}