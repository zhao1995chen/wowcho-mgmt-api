import { Schema,model } from 'mongoose'
import { IProposalDocument, eAgeLimit, eCategory, eStatus } from '../interfaces/Proposal.interface'
import { v4 as uuidv4 } from 'uuid'
import { urlRegex, checkStringNotBlank, checkGreaterCurrentTime, checkGreaterCurrentTimeOrNull, numberIsGreaterThanZero } from '../method/model.method'


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
        message: '類別必須是數字 `0` 至 `6`'
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
      // required: [ true, '募資活動詳細介紹必填' ],
      // validate: {
      //   validator: checkStringNotBlank,
      //   message: '不能為空'
      // },
    },
    targetPrice: {
      type: Number,
      required: [ true, '募資活動達標金額必填' ],
      validate: {
        validator: numberIsGreaterThanZero,
        message: '僅能輸入零以上的數字',
      }
    },
    nowPrice: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Number,
      required: [ true, '募資活動開始時間必填' ],
      validate: {
        validator :checkGreaterCurrentTime,
        message: '僅能超過當前時間'
      },
    },
    endTime: {
      type: Number,
      default:null,
      validate: {
        validator :checkGreaterCurrentTimeOrNull,
        message: '僅能超過當前時間'
      },
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
      default: () => uuidv4(),
      validate: {
        validator: checkStringNotBlank,
        message: '不能為空'
      },
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
    faqIdList:  [{
      type: Schema.Types.ObjectId,
      ref: 'faq'
    }],
    // promiseId: [{
    //   type: Schema.Types.ObjectId,
    //   ref: 'promise'
    // }],
    serviceContact: {
      type: String,
      default: '',
    },
    risksChallenge: {
      type: String,
      default: '',
    },
    returnGoods: {
      type: String,
      default: '',
    },
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

// 新增方案 id 至募資活列表
ProposalSchema.methods.pushPlan = function(id) {
  this.planIdList.push(id)
  return this.save()
}

// 移除方案 id
ProposalSchema.methods.removePlan = function(array) {
  this.planIdList.forEach((value, index) => {
    if (array.includes(value)) {
      this.planIdList.splice(index, 1)
    }
  })
  return this.save()
}

// 購買時增加當前購買數
ProposalSchema.methods.addNowBuyers = function() {
  this.nowBuyers += 1
  return this.save()
}

// 購買時增加當前募資總金額
ProposalSchema.methods.addNowPrice = function(Price:number) {
  this.nowPrice += Price
  return this.save()
}

const Proposal = model<IProposalDocument>('proposal', ProposalSchema)

export {
  Proposal,
  ProposalSchema
}