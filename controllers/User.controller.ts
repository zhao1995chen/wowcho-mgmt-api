// 會員相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { User } from '../models/User.model'
import { errorHandler } from '../services/errorHandler'

export const UserController = {
  async get(req: Request, res: Response) {
    // 取得會員資料
    try {
      const data = await User.find().catch(() => { throw '會員不存在' })
      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async update(req: Request, res: Response) {
    // 修改會員資料
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}