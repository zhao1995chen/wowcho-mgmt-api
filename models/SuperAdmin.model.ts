import { Schema, model } from 'mongoose'
import { ISuperAdmin } from '../interfaces/Superadmin.interface'

const SupeAdminSchema = new Schema<ISuperAdmin>(
  {
    account: {
      type: String,
      required: [ true, '帳號必填' ]
    },
    password: {
      type: String,
      minlength: [ 8, '密碼最少要 8 碼'],
      required: [ true, '密碼必填' ],
    },
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

const SuperAdmin = model<ISuperAdmin>('superadmin', SupeAdminSchema)

export {
  SuperAdmin,
  SupeAdminSchema
}