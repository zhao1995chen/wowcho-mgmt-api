// 贊助相關
import { Schema, model } from 'mongoose'
import { ISponsor } from '../interfaces/Sponsor.interface'

const SponsorSchema = new Schema<ISponsor>(
    totalMoney: {
      type: Number,
      required: [ true, '總金額必填' ]
    },
    orderStatus: {
      type: Number,
      required: [ true, '訂單狀態必填' ]
    },
    shippingStatus: {
      type: Number,
      required: [ true, '出貨狀態必填' ]
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Sponsor = model<ISponsor>('Sponsor', SponsorSchema)

export {
  Sponsor,
  SponsorSchema
}