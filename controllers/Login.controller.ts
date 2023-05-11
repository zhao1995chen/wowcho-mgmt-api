import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Login } from '../models/Login.model'
import bcrypt from 'bcryptjs'
import { ILogin } from '../interfaces/Login.interface'
import { generateToken } from '../middlewares/Auth.middleware'
import { User } from '../models/User.model'
import { ERROR } from '../const'

export const LoginController = {
  async login(req: Request, res: Response) {
    try {
      // console.log('body', req.body)
      const loginData = new Login(req.body)
      
      // 驗證資料
      const validateError = loginData.validateSync()
      if (validateError) throw { message: validateError }

      // 查找會員
      const user = await User.findOne<ILogin>({ account: loginData.account })
      // console.log('user', loginData.password, user.password)
      if (!user) throw { fieldName: '帳號', message: ERROR.INVALID }

      // 驗證密碼
      const validPassword = await bcrypt.compare(loginData.password, user.password)
      if (!validPassword) throw { fieldName: '密碼', message: ERROR.WRONG_DATA }
      // console.log('password pass')

      // 創建 JWT
      const token = generateToken(user)
      // console.log('jwt', token)

      // 保存 JWT
      // res.cookie('token', token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: true,
      //   signed: true,
      //   expires: new Date(Date.now() + process.env.COOKIE_EXP) // 3 天後過期
      // })

      successHandler(res, { token })
    } catch(e) {
      errorHandler(res, e)
    }
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
}