import { Document } from 'mongoose'

interface ISuperAdmin extends Document {
  account: string // 帳號
  password: string // 密碼
}

export {
  ISuperAdmin
}