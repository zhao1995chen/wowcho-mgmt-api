import jwt from 'jsonwebtoken'
import { ILogin } from '../interfaces/Login.interface'

// 產生 token
const generateToken = (user: ILogin) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

export {
  generateToken
}