import { Schema, model } from 'mongoose'
import { IRegister } from '../interfaces/Register.interface'

const RegisterSchema = new Schema<IRegister>(
  {
    account: {
      type: String,
      required: [ true, '帳號必填' ]
    },
    password: {
      type: String,
      minlength: [ 8, '密碼最少要 8 碼'],
      required: [ true, '密碼必填' ],
      select: false
    },
    email: {
      type: String,
      required: [ true, '信箱必填' ],
      validate:{
        validator: (email: string) => {
          const regExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          return regExp.test(email)
        },
        message: ({value}) => `${value} 不符合驗證格式`
      }
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Register = model<IRegister>('user', RegisterSchema)

export {
  Register,
  RegisterSchema
}