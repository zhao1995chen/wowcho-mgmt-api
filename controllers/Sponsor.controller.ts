// 贊助相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { Sponsor } from '../models/Sponsor.model'
// import { User } from '../models/User.model'
import { errorHandler } from '../services/errorHandler'
import { ERROR } from '../const'

export const SponsorController = {
  // 取得贊助列表
  async getList(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const { customizedUrl } = req.query
      // 從 sponsor 表中撈出該使用者的贊助資料，並取得對應頁數的內容
      const sponsorList = await Sponsor.find({ customizedUrl: customizedUrl, payStatus:true })
        .populate('buyerId')
        .populate('ownerId')
        .populate('planId')
        .populate('proposalId')

        .sort({ createTime: -1 })
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
        .catch(() => { 
          throw { message: ERROR.GENERAL }
        }) 
      const totalCount = await Sponsor.countDocuments({ customizedUrl: customizedUrl })

      const data = {
        list: sponsorList,
        totalCount,
      }
      successHandler(res,data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 取得贊助詳細
  async get(req: Request, res: Response) {
    try {
      const id = req.query.id

      // 從 sponsor 表中撈出該使用者的贊助資料，並取得對應頁數的內容
      const data = await Sponsor.findById(id)
        .populate('buyerId')
        .populate('ownerId')
        .populate('planId')
        .populate('proposalId')
        .catch(() => {
          throw  { fieldName: '贊助紀錄', message: ERROR.INVALID }
        })
      if (!data) {
        throw { message: ERROR.GENERAL }
      }
      // 計算總頁數, 有可能 user 的 sponsorIdList 取得的 sponsor 資料不一
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}