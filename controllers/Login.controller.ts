import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Login } from '../models/Login.model'
import bcrypt from 'bcryptjs'
import { ILogin } from '../interfaces/Login.interface'
import { generateToken } from '../middlewares/Auth.middleware'

export const LoginController = {
  async login(req: Request, res: Response) {
    try {
      // console.log('body', req.body)
      const loginData = new Login(req.body)
      
      // 驗證資料
      const validateError = loginData.validateSync()
      if (validateError) throw validateError

      // 查找會員
      const user = await Login.findOne<ILogin>({ account: loginData.account })
      if (!user) throw '帳號不存在'

      // 驗證密碼
      const validPassword = await bcrypt.compare(loginData.password, user.password )
      if (!validPassword) throw '密碼輸入錯誤'
      // console.log('password pass')

      // 創建 JWT
      const token = generateToken(user)
      // console.log('jwt', token)

      // 保存 JWT
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        signed: true,
        expires: new Date(Date.now() + process.env.COOKIE_EXP) // 3 天後過期
      })

      successHandler(res)
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
}