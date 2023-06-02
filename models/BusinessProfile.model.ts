import { Schema } from 'mongoose'
import { IBusinessProfile } from '../interfaces/BusinessProfile.interface'
import { User } from './User.model'

const BusinessProfileSchema = new Schema<IBusinessProfile>(
  {
    businessName: {
      type: String,
      required: [ true, '提案單位名稱必填' ]
    },
    businessIntro: {
      type: String,
      default: ''
    },
    businessImage: {
      type: String,
      default:''
    },
    businessEmail:{
      type: String,
      required: [ true, '商業檔案 email 必填 ' ]
    },
    facebook:{
      type: String,
    },
    instagram: {
      type:String,
    },
    website:{
      type:String,
    }
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

const BusinessProfile = User.discriminator<IBusinessProfile>('business', BusinessProfileSchema)

export {
  BusinessProfile,
  BusinessProfileSchema
}