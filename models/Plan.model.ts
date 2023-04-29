import { Schema,model } from 'mongoose'
import { IPlan } from '../interfaces/Plan.interface'

const SpecificationSchema = new Schema({
  title: {
    type: String,
    required: [true, '規格標題必填'],
  },
  option: {
    type: [String],
    validate: {
      validator (options) {
        return options.length > 0
      },
      message: '選項必須設定最少一個值',
    },
  },
})

const PlanSchema = new Schema<IPlan>(
  {
    proposalId: {
      type: Schema.Types.ObjectId,
      required: [ true, '募資專案 ID 必填' ]
    },
    image: {
      type: String,
      required: [ true, '募資方案預覽圖必填' ]
    },
    name: {
      type: String,
      required: [ true, '募資方案名稱必填' ]
    }, 
    summary: {
      type: String,
      required: [ true, '募資方案簡介必填' ]
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    actualPrice: {
      type: Number,
      required: [ true, '募資方案實際價格必填' ]
    },
    quantity: {
      type: Number,
      default: null,
    },
    pickupDate: {
      type: Number,
      default: null,
    },
    toSponsor:{
      type: String,
      default:''
    },
    specification: [SpecificationSchema],
    freightMainIsland:{
      type: Number,
      default:null
    },
    freightOuterIsland:{
      type: Number,
      default:null
    },
    freightOtherCountries: {
      type: Number,
      default:null
    }
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

const Plan = model<IPlan>('plan', PlanSchema)

export {
  Plan,
  PlanSchema
}