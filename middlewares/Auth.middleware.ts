import jwt from 'jsonwebtoken'
import { ILogin } from '../interfaces/Login.interface'
import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { Error } from 'mongoose'
import { ERROR } from '../const'
import { ISuperAdmin } from '../interfaces/Superadmin.interface'

// 產生 token
const generateToken = (user: ILogin | ISuperAdmin) => {
  // console.log('jwt', user)

  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// 驗證 token
const isAuth = async (req: Request, res: Response, next: any) => {
  try {
    let token: string
    // console.log(req.headers.authorization)

    // 確認 token 存在及格式正確
    if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1]
    if (!token)  throw { message: ERROR.PERMISSION_DENIED }

    // 驗證 token 值正確
    jwt.verify(token, process.env.JWT_SECRET, (e: Error, payload: any) => {
      // console.log(e)
      if (e instanceof jwt.NotBeforeError) {
        throw { message: ERROR.TOKEN_NOT_BOFORE }
      }
      if (e instanceof jwt.TokenExpiredError) {
        throw { message: ERROR.TOKEN_EXPIRED }
      }
      if (e instanceof jwt.JsonWebTokenError) {
        throw { message: ERROR.TOKEN_MALFORMED}
      } 
      if (e) {
        throw { message: e }
      }

      // 傳遞 id 給後續操作
      req.body._id = payload.id
    })

    next()
  } catch(e) {
    errorHandler(res, e)
  }
}

export {
  generateToken,
  isAuth
}