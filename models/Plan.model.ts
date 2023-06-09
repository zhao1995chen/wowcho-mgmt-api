import { Schema,model } from 'mongoose'
import { IPlan } from '../interfaces/Plan.interface'
import { urlRegex, checkStringNotBlank,  checkGreaterCurrentTime, numberIsGreaterThanZero, checkNumIsGreaterThanZeroOrNull } from '../method/model.method'

// 規格
const specificationSchema = new Schema({
  title: {
    type: String,
    required: [true, '規格標題必填'],
    validate: {
      validator: checkStringNotBlank,
      message: '不能為空'
    },
  },
  option: {
    // option 中必須有值
    type: [String],
    required: [true, '規格選項必填'],
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
    proposalUrl: {
      type:String,
      required: [ true, '募資活動專屬 URL 必填' ]
    },
    image: {
      type: String,
      required: [ true, '募資方案預覽圖必填' ],
      validate: {
        validator: function (value) {
          return value.match(urlRegex)
        },
        message: '僅能輸入網址'
      }
    },
    name: {
      type: String,
      required: [ true, '募資方案名稱必填' ],
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
    }, 
    summary: {
      type: String,
      required: [ true, '募資方案簡介必填' ],
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
    },
    originalPrice: {
      type: Number,
      required: [ true, '募資方案原始價格必填' ],
      validate: {  
        validator :numberIsGreaterThanZero,
        message: '原價不可小於 0'
      },
    },
    actualPrice: {
      type: Number,
      required: [ true, '募資方案實際價格必填' ],
      validate: {
        validator :numberIsGreaterThanZero,
        message: '實際價格不可小於 0'
      },
    },
    quantity: {
      type: Number,
      default: null,
      validate: {
        validator :checkNumIsGreaterThanZeroOrNull,
        message: '方案數量若有輸入時不可小於 0'
      },
    },
    nowBuyers: {
      type: Number,
      default: 0,
    },
    pickupDate: {
      type: Number,
      default: null,
    },
    toSponsor:{
      type: String,
      default:'',
    },
    specification: [specificationSchema],
    freightMainIsland:{
      type: Number,
      default:null,
    },
    freightOuterIsland:{
      type: Number,
      default:null,
    },
    freightOtherCountries: {
      type: Number,
      default:null,
    }
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

PlanSchema.pre('save', function(next) {
  // 僅在新增時觸發的邏輯
  if (this.isNew) {
    // customizedUrl 若為空字串，使用 uuid替換
    // 驗證開始時間，若沒超過當前時間抱錯
    if (!checkGreaterCurrentTime(this.pickupDate)) {
      next(new Error('出貨時間，僅能超過當前時間'))
    }
  }
  next()
})

const Plan = model<IPlan>('plan', PlanSchema)

export {
  Plan,
  PlanSchema
}