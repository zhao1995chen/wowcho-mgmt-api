import { Schema,model } from 'mongoose'
import { IProposalDocument, eAgeLimit, eCategory, eStatus } from '../interfaces/Proposal.interface'
import { v4 as uuidv4 } from 'uuid'
import { urlRegex, checkStringNotBlank, checkStringNotBlankOrNull, checkGreaterCurrentTime, checkGreaterCurrentTimeOrNull, numberIsGreaterThanZero } from '../method/model.method'

const ProposalSchema = new Schema<IProposalDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    image: {
      type: String,
      required: [ true, '募資活動預覽圖必填' ],
      validate: {
        validator (value) {
          return value.match(urlRegex)
        },
        message: '僅能輸入網址'
      }
    },
    video: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: [ true, '募資活動名稱必填' ],
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
    }, 
    category: {
      type: Number,
      required: [ true, '募資活動分類必填' ],
      enum: {
        values: Object.values(eCategory),
        message: '類別必須是數字 1 至 8'
      },
    },
    summary: {
      type: String,
      required: [ true, '募資活動簡介必填' ],
      // cast: '{VALUE} 僅能為字串',
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
    },
    description: {
      type: String,
      required: [ true, '募資活動詳細介紹必填' ],
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
    },
    targetPrice: {
      type: Number,
      required: [ true, '募資活動達標金額必填' ],
      validate: {
        validator: numberIsGreaterThanZero,
        message: '達標金額僅能輸入零以上的數字',
      }
    },
    nowPrice: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Number,
      required: [ true, '募資活動開始時間必填' ],
    },
    endTime: {
      type: Number,
      required: [ true, '募資活動結束時間必填' ],
    },
    ageLimit: {
      type: Number,
      default: 0,
      enum: {
        values: Object.values(eAgeLimit),
        message: '年齡限制必須是數字 `0` 或 `1`'
      },
    },
    customizedUrl: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
      enum: eStatus
    },
    // 關聯
    planIdList:[
      {
        type: Schema.Types.ObjectId,
        ref: 'plan',
      }
    ],
    placardIdList:[
      {
        type: Schema.Types.ObjectId,
        ref: 'placard',
      }
    ],
    faqIdList:  [{
      type: Schema.Types.ObjectId,
      ref: 'faq'
    }],
    messageIdList:[
      {
        type: Schema.Types.ObjectId,
        ref: 'message'
      }
    ],
    contact: {
      type: String,
      default: '',
    },
    risk: {
      type: String,
      default: '',
    },
    refund: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

// 中間層
// 新增前觸發
ProposalSchema.pre('save', function(next) {
  // 僅在新增時觸發的邏輯
  if (this.isNew) {
    // customizedUrl 若為空字串，使用 uuid替換
    if (this.customizedUrl === '') {
      this.customizedUrl = uuidv4()
    }
    // 驗證開始時間，若沒超過當前時間抱錯
    if (!checkGreaterCurrentTime(this.startTime)) {
      next(new Error('募資開始時間，僅能超過當前時間'))
    }
    if (!checkGreaterCurrentTime(this.endTime)) {
      next(new Error('募資結束時間，僅能超過當前時間'))
    }
  }
  next()
})

// 更新前觸發
// ProposalSchema.pre('findOneAndUpdate', function(next) {
//   // 若 customizedUrl 是空字串，使用 uuid 代替
//   const update = this.getUpdate()
//   // 如果是物件，並且有 customizedUrl key 以及 customizedUrl 是空字串。
//   if (typeof update === 'object' && 'customizedUrl' in update && update.customizedUrl === '') {
//     update.customizedUrl = uuidv4()
//   }
//   next()
// })

// 新增方案 id 至募資活列表
ProposalSchema.methods.pushPlan = async function(id) {
  this.planIdList.push(id)
  await this.save()
}

// 移除方案 id
ProposalSchema.methods.removePlan = async function(array) {
  this.planIdList.forEach((value, index) => {
    if (array.includes(value)) {
      this.planIdList.splice(index, 1)
    }
  })
  await this.save()
}

// 新增常見問答 id 至募資活列表
ProposalSchema.methods.pushFaq = async function(id) {
  this.faqIdList.push(id)
  await this.save()
}

// 移除常見問答 id
ProposalSchema.methods.removeFaq = async function(array) {
  this.faqIdList.forEach((value, index) => {
    if (array.includes(value)) {
      this.faqIdList.splice(index, 1)
    }
  })
  await this.save()
}

// 新增專案進度 id 至募資活列表
ProposalSchema.methods.pushPlacard = async function(id) {
  this.placardIdList.push(id)
  await this.save()
}

// 移除專案進度 id
ProposalSchema.methods.removhPlacard = async function(array) {
  this.placardIdList.forEach((value, index) => {
    if (array.includes(value)) {
      this.placardIdList.splice(index, 1)
    }
  })
  await this.save()
}

const Proposal = model<IProposalDocument>('proposal', ProposalSchema)

export {
  Proposal,
  ProposalSchema
}