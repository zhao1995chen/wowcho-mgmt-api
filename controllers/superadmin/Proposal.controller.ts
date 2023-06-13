import { Request, Response } from 'express'
import { errorHandler } from '../../services/errorHandler'
import { Proposal } from '../../models/Proposal.model'
import { successHandler } from '../../services/successHandler'
import { ERROR } from '../../const'
import { eStatus } from '../../interfaces/Proposal.interface'
import { SuperAdmin } from '../../models/SuperAdmin.model'
import { ISuperAdmin } from '../../interfaces/Superadmin.interface'
import bcrypt from 'bcryptjs'

export const ProposalController = {
  // 獲取提案列表
  async get(req: Request, res: Response) {
    try {
      const pageSize = +req.query.pageSize || 50
      const page = +req.query.page || 1

      // 判斷是否空值，若空則排除搜尋
      const queryData = Object.keys(req.query)
        .filter(e => req.query[e] !== null && req.query[e] !== '')
        .reduce((res, key) => (res[key] = req.query[key], res), {})
      // console.log(queryData)
      const list = await Proposal.find(queryData)
        .skip(pageSize * (page - 1))
        .limit(pageSize)
      // console.log(list)
      
      const totalCount = await Proposal.countDocuments()
      const data = {
        list,
        totalCount
      }

      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 操作提案：審核，停權
  async update(req: Request, res: Response) {
    try {
      const { id } = req.body
      const status = +req.body.status

      // 確認提案存在
      const proposal = await Proposal.findById(id)
      if (!proposal) throw { message: ERROR.GENERAL }

      // 確認是狀態有效值
      let flag = false
      if (!Object.values(eStatus).includes(status)) {
        throw { message: ERROR.INVALID }
      }

      // 確認狀態變更符合邏輯設定
      switch(status) {
      case eStatus.APPROVED:
      case eStatus.REJECTED:
        if (proposal.status === eStatus.WAITING_FOR_APPROVAL) {
          flag = true
        }
        break
      case eStatus.SUSPEND:
        if (proposal.status === eStatus.APPROVED) {
          flag = true
        } 
      }
      if(!flag) throw { message: ERROR.INVALID }

      // 更新狀態
      await Proposal.findByIdAndUpdate(id, { status })
      successHandler(res)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  // 刪除提案（多個）
  async delete(req: Request, res: Response) {
    try {
      const list = new Array(req.query.list)
      const secondSuperAdmin = new SuperAdmin(req.body.secondAdmin)
      // 認證第二個 superadmin 帳號密碼

      // 驗證資料
      const validateError = secondSuperAdmin.validateSync()
      if (validateError) throw { validateMessage: validateError, type: 'validate' }

      // 查找 superadmin
      const superadmin = await SuperAdmin.findOne<ISuperAdmin>({ account: secondSuperAdmin.account })
      if (!superadmin) throw { fieldName: '帳號', message: ERROR.INVALID }

      // 驗證密碼
      const validPassword = await bcrypt.compare(secondSuperAdmin.password, superadmin.password)
      if (!validPassword) throw { fieldName: '密碼', message: ERROR.WRONG_DATA }

      // 確認刪除陣列有資料
      if (list.length === 0) throw { message: ERROR.OPERATION_FAILED }

      // 確認被刪除提案存在
      list.forEach(async _id => {
        const result = await SuperAdmin.findById(_id)
        if (!result) throw { message: ERROR.INVALID, fieldName: _id }
      })
      
      // 刪除提案
      await Proposal.deleteMany({ _id: { $in: list }})
      successHandler(res)
    } catch(e) {
      errorHandler(res, e)
    }
  }
}