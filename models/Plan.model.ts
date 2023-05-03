import { Schema,model } from 'mongoose'
import { IPlanDocument } from '../interfaces/Plan.interface'

// 確認為網址正則
// eslint-disable-next-line no-useless-escape
const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

// 檢查是否為空白字串
function checkStringNotBlank(value: string): boolean {
  return value.trim().length > 0
}

// 檢查給定的時間戳是否大於當前時間
function checkNumOrNull(value: number | null): boolean {
  if (value === null) {
    return true
  }
  return value > 0
}

// 檢查給定的時間戳是否大於當前時間
function checkGreaterCurrentTimeOrNull(value: number | null): boolean {
  if (value === null) {
    return true
  }
  return value > Date.now()
}

// 檢查不可數值不可大於 0 
function checkNumberIsGreaterThanZero(value: number): boolean {
  return value > 0
}

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

const PlanSchema = new Schema<IPlanDocument>(
  {
    proposalId: {
      type: Schema.Types.ObjectId,
      required: [ true, '募資專案 ID 必填' ]
    },
    image: {
      type: String,
      required: [ true, '募資方案預覽圖必填' ],
      validate: {
        validator: function (value) {
          return urlRegex.test(value)
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
      default: null,
      validate: {
        validator :checkNumOrNull,
        message: '原價不可小於 0'
      },
    },
    actualPrice: {
      type: Number,
      required: [ true, '募資方案實際價格必填' ],
      validate: {
        validator :checkNumberIsGreaterThanZero,
        message: '實際價格不可小於 0'
      },
    },
    quantity: {
      type: Number,
      default: null,
      validate: {
        validator :checkNumOrNull,
        message: '原價不可小於 0'
      },
    },
    nowBuyers: {
      type: Number,
      default: 0,
    },
    pickupDate: {
      type: Number,
      default: null,
      validate: {
        validator :checkGreaterCurrentTimeOrNull,
        message: '僅能超過當前時間'
      },
    },
    toSponsor:{
      type: String,
      default:'',
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
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

// 購買時增加方案購買數亮
PlanSchema.methods.addNowBuyers = function() {
  this.nowBuyers += 1
  return this.save()
}

// 購買時若 商品數量 不等於 null ，減少商品總數
PlanSchema.methods.removeQuantity = function() {
  if (this.quantity === null) {
    return
  }
  this.quantity - 1 
  return this.save()
}

const Plan = model<IPlanDocument>('plan', PlanSchema)

export {
  Plan,
  PlanSchema
}