import { Document } from 'mongoose'

interface IFaq extends Document {
  customizedUrl: string
  content: string // 內容
  title: string //	標題
  date: number //	更新時間
}

export {
  IFaq
}