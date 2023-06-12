import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Proposal } from '../models/Proposal.model'
import { IProposal } from '../interfaces/Proposal.interface'
import { ERROR } from '../const'
import { Sponsor } from '../models/Sponsor.model'
import { Plan } from '../models/Plan.model'

export const DashboardController = {
  async get(req: Request, res: Response) {
    try {
      const proposalUrl = req.query.customizedUrl
      
      const proposal = await Proposal.findOne({ customizedUrl: proposalUrl })
      if (!proposal) {
        throw { message: ERROR.GENERAL }
      }
      const newProposal = await proposal.toObject()
      const orderCount = await Sponsor.countDocuments({ customizedUrl: proposalUrl })
      const planCount = await Plan.countDocuments({ proposalUrl })
      // 若方案數量等於零，回傳狀態 2 ，有資料回傳狀態 4

      const dashboardStatus = planCount === 0 ? 2 : 4
      const data = {
        ...newProposal,
        dashboardStatus,
        orderCount
      }
      successHandler(res,data)
    }
    catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}