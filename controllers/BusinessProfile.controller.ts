import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { IBusinessProfile } from '../interfaces/BusinessProfile.interface'
import { BusinessProfile } from '../models/BusinessProfile.model'
import { User } from '../models/User.model'
import { Register } from '../models/Register.model'
import { ERROR } from '../const'

export const BusinessController = {
  // 修改商業
  async update (req: Request, res: Response) {
    try {
      const { _id } = req.body
      const payload = new BusinessProfile(req.body)
      // 驗證資料
      const validateError = payload.validateSync()
      if (validateError) throw { validateMessage: validateError, type: 'validate' }
      // __t 在 Register 上所以使用 Register.find
      const businessProfile = await Register.findByIdAndUpdate<IBusinessProfile>(_id, payload, {
        new: true, // 返回更新後的文檔
        upsert: false, // 如果沒找到匹配的文檔，不要創建新文檔
        runValidators: true, // 觸發 Schema 驗證
      })
      if (!businessProfile) throw  { fieldName: '商業檔案', message: ERROR.INVALID }

      successHandler(res, businessProfile)
    }
    catch(e){
      errorHandler(res, e)
    }
  },
  async get (req: Request, res: Response) {
    try {
      const { _id } = req.body
      const data = await User.findById(_id).select('businessName businessEmail businessIntro businessImage facebook instagram website -_id')

      successHandler(res, data)
    }
    catch(e){
      errorHandler(res, e)
    }
  },
}