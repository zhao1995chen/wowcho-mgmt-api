import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Plan } from '../models/Plan.model'
import { IPlan } from '../interfaces/Plan.interface'
import { Proposal } from '../models/Proposal.model'

export const PlanController = {
  // 新增
  async create(req: Request, res: Response) {
    try {
      const ProposalId = req.body.proposalId
      const newPlan:IPlan = new Plan(req.body)
      // 驗證資料
      const validateError = newPlan.validateSync()
      if (validateError) throw validateError

      // 確認原價是否有值，有值才做驗證
      if(newPlan.originalPrice) {
        if(newPlan.originalPrice > newPlan.actualPrice)  throw '募資方案原價不可大於折扣價格'
      }
      // 尋找募資專案是否存在
      const checkProposal = await PlanController.checkProposal(ProposalId)
      // 若不存在跳錯
      if (!checkProposal) throw '募資活動 ID 不存在'
      // 驗證都通過，儲存新增 plan 至資料庫
      const savedPlan = await newPlan.save()
      // 將 id push 至 Proposal
      checkProposal.planIdList.push(savedPlan._id)
      // 將更新後 Proposal 儲存資料庫
      await checkProposal.save()
      successHandler(res,savedPlan)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async checkProposal(id:string) {
    const proposal = await Proposal.findById({ _id:id })
    return proposal
  },
}