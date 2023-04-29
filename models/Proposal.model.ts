import { Schema,model } from 'mongoose'
import { IProposal } from '../interfaces/Proposal.interface'
import { v4 as uuidv4 } from 'uuid'

const ProposalSchema = new Schema<IProposal>(
  {
    planIdList:[
      {
        type: Schema.Types.ObjectId,
        ref: 'plan',
      }
    ],
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
      type: String,
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
    starTime: {
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
    }
  },
  {
    versionKey: false, // 其實用不到
    timestamps: true // 其實用不到
  }
)

const Proposal = model<IProposal>('proposal', ProposalSchema)

export {
  Proposal,
  ProposalSchema
}