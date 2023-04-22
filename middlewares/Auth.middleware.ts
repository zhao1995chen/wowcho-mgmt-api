import jwt from 'jsonwebtoken'
import { ILogin } from '../interfaces/Login.interface'
import { Request, Response } from 'express'
import { errorHandler } from '../services/errorHandler'
import { User } from '../models/User.model'
import { Error } from 'mongoose'

// 產生 token
const generateToken = (user: ILogin) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// 驗證 token
const isAuth = async (req: Request, res: Response) => {
  try {
    let token: string, _id: string

    // 確認 token 存在及格式正確
    if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1]
    if (!token) throw '請登入後操作'

    // 驗證 token 值正確
    jwt.verify(token, process.env.JWT_SECRET, (e: Error, payload: ILogin) => {
      if (e) {
        throw e
      }
      _id = payload._id
    })

    const currentUser = await User.findById(_id)

    // 傳遞會員資料給後續操作
    req.body.user = currentUser 
  } catch(e) {
    errorHandler(res, e)
  }
}

export {
  generateToken,
  isAuth
}