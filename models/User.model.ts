// 會員相關
import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces/User.interface'

const UserSchema = new Schema<IUser>(
  {
    account: String,
    password: String,
    name: String,
    username: String,
    email: String,
    image: {
      type: String,
      default: null,
    },
    isAllowedNotifications: {
      type: Boolean,
      default: true,
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    customizedUrl: {
      type: String,
      default: null
    },
    gender: {
      type: Number,
      default: 0,
    },
    birthday: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    facebook: {
      type: String,
      default: null,
    },
    instagram: {
      type: String,
      default: null,
    },
    youtube:  {
      type: String,
      default: null,
    },
    memberRole:{
      type: String,
      default: 'default',
    },
    oauthId:{
      type: Schema.Types.ObjectId,
      ref: 'oauthUser'
    },
    __t: {
      type: String,
      select: false
    }
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