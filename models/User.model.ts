// 會員相關
import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/User.interface'

const UserSchema = new Schema<IUser>(
  {
    account: {
      type: String,
      required: [ true, '帳號必填' ]
    }
    // 繼續填寫
  },
  {
    versionKey: false
  }
)

const User = model<IUser>('User', UserSchema)

export {
  User,
  UserSchema
}