import { Document } from 'mongoose'

interface IRegister extends Document {
  account: string // 帳號
  password: string // 密碼
  email: string // 信箱
}

export {
  IRegister
}