import { Schema } from 'mongoose'
import { ILogin } from '../interfaces/Login.interface'
import { User } from './User.model'

const LoginSchema = new Schema<ILogin>(
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

const Login = User.discriminator<ILogin>('login', LoginSchema)

export {
  Login,
  LoginSchema
}