// 會員相關
import { Schema, model } from 'mongoose'
import { IOauthUser } from '../interfaces/OauthUser.interface'

const oauthUserSchema = new Schema<IOauthUser>(
  {
    email: {
      type: String,
      required: [ true, 'email 為必填' ]
    },
    name: {
      type: String,
      required: [ true, '姓名 為必填' ]
    },
    picture: {
      type: String,
      required: [ true, '使用者頭像為必填' ]
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const oauthUser = model<IOauthUser>('oauthUser', oauthUserSchema)

export {
  oauthUserSchema,
  oauthUser
}