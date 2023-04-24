import { Document } from 'mongoose'

interface ILogin extends Document {
  _id?: string
  account: string // 信箱
  password: string // 密碼
}

export {
  ILogin
}