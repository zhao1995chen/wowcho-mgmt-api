// 會員相關
import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/User.interface'

const UserSchema = new Schema<IUser>(
  {
    account:  String,
    password: String,
    name:  String,
    username:  String,
    email: String,
    image:  String,
    isAllowedNotifications:  Boolean,
    isSubscribed:  Boolean,
    customizedUrl:  String,
    gender:  Number,
    birthday:  Number,
    address:  String,
    website:  String,
    facebook: String,
    instagram: String,
    youtube:  String,
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const User = model<IUser>('user', UserSchema)

export {
  User,
  UserSchema
}