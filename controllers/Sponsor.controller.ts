// 贊助相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { Sponsor } from '../models/Sponsor.model'
// import { User } from '../models/User.model'
import { errorHandler } from '../services/errorHandler'

export const SponsorController = {
  async get(req: Request, res: Response) {
    // 取得贊助列表
    try {
      const { orderPlanId, page: currentPage, pageSize } = req.body

      // 從 sponsor 表中撈出該使用者的贊助資料，並取得對應頁數的內容
      const list = []
      const sponsorList = await Sponsor.find({ orderPlanId:  orderPlanId }).sort({ createTime: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        sponsorList.forEach((item) => {
          console.log(item);
          
          list.push({
            id: item._id,
            orderNumber: item._id,
            // 後續要使用 item.orderPlanId 改成從 project 表中撈出對應的 projectTitle, orderPlan
            projectName: "超早鳥 - 潮到出水短T",
            purchaserName: item.recipientName,
            memberNumber: "0000000001",
            purchaserDate: item.createTime,
            price: item.totalMoney,
            payment: item.payWay, // payment
            orderStatus: item.orderStatus,
            shipStatus: item.shippingStatus,
            lastUpdateTime: item.updateTime,
          })
        })

      // 計算總頁數, 有可能 user 的 sponsorIdList 取得的 sponsor 資料不一
      const totalNun = (await Sponsor.find({ orderPlanId:  orderPlanId })).length
      const totalPage = Math.ceil(totalNun / pageSize)

      const data = {
        list,
        currentPage,
        pageSize,
        totalPage
      }
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}