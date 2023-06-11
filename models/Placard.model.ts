import { Schema, model } from 'mongoose'
import { IPlacard } from '../interfaces/Placard.interface'

const PlacardSchema = new Schema<IPlacard>(
  {
    customizedUrl: {
      type:String,
      required: [ true, '募資活動專屬 URL 必填' ]
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


const  Placard = model<IPlacard>('placard', PlacardSchema)

export {
  Placard,
  PlacardSchema
}