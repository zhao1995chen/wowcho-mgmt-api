import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Proposal } from '../models/Proposal.model'
import { IProposal } from '../interfaces/Proposal.interface'

export const ProposalController = {
  // 新增
  async create(req: Request, res: Response) {
    try {
      req.body.ownerId = req.body._id
      delete req.body._id
      const newProposal:IProposal = new Proposal(req.body)
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

    if (await Proposal.exists({ customizedUrl })) return '專案網址已使用'
    return
  },
  // 獲得列表
  async getList(req: Request, res: Response) {
    try {
      const pageSize = Number(req.query.pageSize) || 10 // 每頁顯示幾筆資料
      const page = Number(req.query.page) || 1 // 目前頁數
      const proposalList = await Proposal.find({ ownerId: req.body._id })
        .select('_id imageUrl name category summary targetPrice starTime endTime updatedAt createdAt')
        .skip((pageSize * page) - pageSize)
        .limit(pageSize)
      successHandler(res, proposalList)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 獲得詳細資訊
  async get(req: Request, res: Response) {
    try {
      const id = req.query.id // 每頁顯示幾筆資料
      const proposal = await Proposal.findOne<IProposal>({ _id:id })
      if (!proposal) throw '募資活動 ID 錯誤'
      // 資料擁有者 和 JWT 使用者不匹配
      if (proposal.ownerId.toString() !== req.body._id) throw '無權查看此募資活動'
      successHandler(res, proposal)
    }
    catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
  overTime(value: IProposal) {
    const { starTime, endTime } = value
    if ( starTime >= endTime ) return '活動開始時間不可晚於結束時間'
  }
}