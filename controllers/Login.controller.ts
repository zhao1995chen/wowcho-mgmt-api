import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'
import { Login } from '../models/Login.model'
import bcrypt from 'bcryptjs'
import { ILogin } from '../interfaces/Login.interface'
import { generateToken } from '../middlewares/Auth.middleware'
import { User } from '../models/User.model'
import { ERROR } from '../const'
import { oauthUser } from '../models/OauthUser.model'
import { OAuth2Client } from 'google-auth-library'
const OAUTH_ID = process.env.OAUTH_ID
const client = new OAuth2Client(OAUTH_ID)

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
  async oauthLogin(req: Request, res: Response) {
    try {
      const { token }  = req.body
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: OAUTH_ID, 
      }).catch(()=> {
        throw {  message: '第三方登入資訊錯誤，請聯繫渦潮人員' }
      })
      const userPayload = ticket.getPayload()

      // 尋找地方三登入資料庫是否有該 email
      const member = await oauthUser.findOne({ email: userPayload.email }).catch(()=> {
        throw {  message: '第三方登入資訊錯誤，請聯繫渦潮人員' }
      })
      
      let useToken = null
      // 有資料
      if(member !== null) {
        // 有資料時撈關聯 user 資料
        const user = await User.findOne({ oauthId: member._id, memberRole:'google' }).catch(()=> {
          throw {  message: '第三方登入資訊錯誤，請聯繫渦潮人員' }
        })

        // 創建 JWT
        useToken = generateToken(user)
      } else { // 沒資料，新增 oauthUser 、 user 資料
        const { email, name, picture } = userPayload
        const newOauthUser = new oauthUser({
          email, name, picture
        })

        const user = new User({
          oauthId: newOauthUser._id, // 將 user 的 oauthUser 欄位設定為 OauthUser 的 _id
          memberRole: 'google',
          name,
          username: name,
          image: picture,
          email: email,
          // account: email
        })
        await newOauthUser.save()
        const newUser = await user.save()
        useToken = generateToken(newUser)
      }
      successHandler(res, { token:useToken })
    } catch (e) {
      errorHandler(res, e)
    }
  
  },
  options(req: Request, res: Response) {
    successHandler(res)
  },
}