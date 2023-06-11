import { Schema, model } from 'mongoose'
import { IFaq } from '../interfaces/Faq.interface'

const FaqSchema = new Schema<IFaq>(
  {
    customizedUrl: {
      type:String,
      required: [ true, '募資提案專屬 URL 必填' ]
    },
    content: String,
    title: String,
    date: String
  },
  {
    versionKey: false,
    timestamps: true
  }
)


const  Faq = model<IFaq>('faq', FaqSchema)

export {
  Faq,
  FaqSchema
}