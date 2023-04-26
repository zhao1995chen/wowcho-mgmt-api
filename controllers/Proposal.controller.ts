import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Proposal } from '../models/Proposal.model'
import { User } from '../models/User.model'
import { IProposal } from '../interfaces/Proposal.interface'

export const ProposalController = {
  async create(req: Request, res: Response) {
    try {
      req.body.user = req.body._id
      delete req.body._id
      const newProposal = new Proposal(req.body)
      // 驗證資料
      const validateError = newProposal.validateSync()
      if (validateError) throw validateError

      // 募資活動網址重複
      const duplicate = await ProposalController.duplicate(newProposal)
      if (duplicate) throw duplicate
      
      // 檢查開始時間、結束時間
      const overTime = ProposalController.overTime(newProposal)
      if (overTime) throw overTime

      // 創建募資活動
      await Proposal.create(newProposal)
      successHandler(res)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async duplicate(value: IProposal) {
    // console.log(value)

    const { customizedUrl } = value

    if (await User.exists({ customizedUrl })) return '專案網址已使用'
    return
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
  overTime(value: IProposal) {
    const { starTime, endTime } = value
    if ( starTime >= endTime ) return '活動開始時間不可晚於結束時間'
  }
}