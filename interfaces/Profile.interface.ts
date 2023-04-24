import { Document } from 'mongoose'

enum Gender {
  Null = -1, // null
  Other = 0, // 其他
  PhysicalMale = 1, // 生理男
  PhysicalFemale = 2, // 生理女
  MentalMale = 3, // 心理男
  MentalFemale = 4, // 心理女
}

interface IProfile extends Document {
  account: string // 帳號
  name: string // 真實姓名
  username: string // 用戶名稱
  email: string // 信箱
  image?: string | null // 用戶圖片網址
  isAllowedNotifications: boolean // 允許通知
  isSubscribed: boolean // 訂閱電子報
  customizedUrl?: string // 客製化網址
  gender: -1 | 0 | 1 | 2 | 3 | 4 // 性別
  birthday?: number | null // 生日
  address?: string | null // 地址
  website?: string | null // 個人網站
  facebook?: string | null // FB 網址
  instagram?: string | null // IG 網址
  youtube?: string | null // YT 網址
}

export {
  Gender,
  IProfile
}