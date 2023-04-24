import { Schema, model } from 'mongoose'
import { IProfile } from '../interfaces/Profile.interface'

const ProfileSchema = new Schema<IProfile>(
  {
    account: {
      type: String,
      required: [true, '帳號必填'],
      unique: true,
      immutable: true // 設置該欄位為不可更改
    },
    name: {
      type: String,
      required: [true, '真實姓名必填'],
    },
    username: {
      type: String,
      required: [true, '用戶名稱必填'],
    },
    email: {
      type: String,
      required: [true, '信箱必填'],
    },
    image:  String,
    isAllowedNotifications: {
      type: Boolean,
      required: [true, '是否允許通知必填'],
    },
    isSubscribed: {
      type: Boolean,
      required: [true, '是否訂閱電子報必填'],
    },
    customizedUrl:  String,
    gender: {
      type: Number,
      required: [true, '性別必填'],
      enum: [ -1, 0, 1, 2, 3, 4 ],
    },
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

const Profile = model<IProfile>('User', ProfileSchema)

export {
  Profile,
  ProfileSchema
}
