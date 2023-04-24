// 會員相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { IProfile } from '../interfaces/Profile.interface'
import { Profile } from '../models/Profile.model'

export const ProfileController = {
  async get(req: Request, res: Response) {
    // 取得會員資料
    try {
      const { _id } = req.body
      const data: IProfile = await Profile.findById(_id).select({ _id: 0, password: 0 })
      // console.log('get', data)

      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  async update(req: Request, res: Response) {
    // 修改會員資料
    try {
      const { _id } = req.body
      const payload = new Profile(req.body)
      // console.log('update', payload)

      // 驗證資料
      const validateError = payload.validateSync()
      if (validateError) throw validateError

      await Profile.findOneAndUpdate({ _id }, payload)
      const data = await Profile.findById(_id).select({ _id: 0, password: 0 })

      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  }
}