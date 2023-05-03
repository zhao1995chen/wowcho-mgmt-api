import bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Register } from '../models/Register.model'
import { IRegister } from '../interfaces/Register.interface'
import { HASH_TIME } from '../const'
import { User } from '../models/User.model'

export const RegisterController = {
  async create(req: Request, res: Response) {
    try {
      // console.log('body', req.body)
      const newMember = new Register(req.body)

      // 驗證資料
      const validateError = newMember.validateSync()
      if (validateError) throw validateError

      // console.log('register', req.body, newMember)
      // 確認沒有重複的 account 跟 email
      const duplicate = await RegisterController.duplicate(newMember)
      if (duplicate) throw duplicate
      
      // 創建新會員
      const { account, email, password } = newMember
      const hashPassword = await bcrypt.hash(password, HASH_TIME)
      // console.log('hash', hashPassword)

      await Register.create({
      // const user = await Register.create({
        account,
        email,
        name: account,
        username: account,
        password: hashPassword
      })
      // console.log('user', user)

      // 回傳 200 成功
      successHandler(res)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
  async duplicate(value: IRegister) {
    // console.log(value)

    const { account, email } = value

    if (await User.exists({ account })) return '帳號已使用'
    if (await User.exists({ email })) return '信箱已使用'
    return
  }
}