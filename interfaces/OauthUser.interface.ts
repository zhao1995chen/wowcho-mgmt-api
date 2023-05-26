import { Document } from 'mongoose'

interface IOauthUser extends Document {
  email: string // 信箱
  name: string // 密碼
  picture: string // 照片
}

export {
  IOauthUser
}