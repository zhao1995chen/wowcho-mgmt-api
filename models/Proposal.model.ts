import { Schema,model } from 'mongoose'
import { IProposalDocument } from '../interfaces/Proposal.interface'
import { v4 as uuidv4 } from 'uuid'

const ProposalSchema = new Schema<IProposalDocument>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
    imageUrl: {
      type: String,
      required: [ true, '募資活動預覽圖必填' ]
    },
    video: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      required: [ true, '募資活動名稱必填' ]
    }, 
    category: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6],
      required: [ true, '募資活動分類必填' ]
    },
    summary: {
      type: String,
      required: [ true, '募資活動簡介必填' ]
    },
    description: {
      type: String,
      required: [ true, '募資活動詳細介紹必填' ]
    },
    targetPrice: {
      type: Number,
      required: [ true, '募資活動達標金額必填' ]
    },
    nowPrice: {
      type: Number,
    },
    startTime: {
      type: Number,
      required: [ true, '募資活動開始時間必填' ]
    },
    endTime: {
      type: Number,
      required: [ true, '募資活動結束時間必填' ]
    },
    ageLimit: {
      type: Number,
      required: [ true, '年齡限制必填' ]
    },
    customizedUrl: {
      type: String,
      default: () => uuidv4()
    },
    status: {
      type: Number,
      default: 1
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
    promiseId: [{
      type: Schema.Types.ObjectId,
      ref: 'promise'
    }],
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
ProposalSchema.methods.removePlan = function(id) {
  const index = this.planIdList.findIndex(item => item === id)
  this.planIdList.splice(index,1)
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