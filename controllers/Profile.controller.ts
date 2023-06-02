// 會員相關

import { Request, Response } from 'express'
import { successHandler } from '../services/successHandler'
import { errorHandler } from '../services/errorHandler'
import { Profile } from '../models/Profile.model'
import { User } from '../models/User.model'
import { IProfile } from '../interfaces/Profile.interface'

export const ProfileController = {
  async get(req: Request, res: Response) {
    // 取得會員資料
    try {
      const { _id } = req.body
      const data = await User.findById(_id).select({ _id: 0, password: 0 })
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

      // 驗證資料
      const validateError = payload.validateSync()
      if (validateError) throw { validateMessage: validateError, type: 'validate' }

      // 確認 email 是否變更
      const oldProfileData = await User.findById(_id)
      if (payload.email !== oldProfileData.email) {
        // 確認沒有重複的 email
        const duplicate = await ProfileController.duplicate(payload)
        if (duplicate) throw { message: duplicate }
      }
      await User.findOneAndUpdate({ _id }, payload)
      const data = await User.findById(_id).select({ _id: 0, password: 0 })

      successHandler(res, data)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
  async duplicate(value: IProfile) {
    // console.log(value)

    const { email } = value
    
    if (await User.exists({ email })) return '信箱已使用'
    return
  }
}