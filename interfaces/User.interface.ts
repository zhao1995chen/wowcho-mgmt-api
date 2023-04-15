// 會員相關
// 不同 interface 想拆開也可以，這裡先做多個 interface 的示範

interface ILogin {
  account: string // 信箱
  password: string // 密碼
}

interface IRegister {
  account: string // 信箱
  password: string // 密碼
}

interface IUser {
  account: string // 帳號
  name: string // 真實姓名
  username: string // 用戶名稱
  email: string // 信箱
  image?: string // 用戶圖片網址
  isAllowedNotifications: boolean // 允許通知
  isSubscribed: boolean // 訂閱電子報
  customedUrl: string // 客製化網址
  gender: number // 性別
  birthday?: number // 生日
  address?: string // 地址
  website?: string // 個人網站
  facebook?: string // FB 網址
  instagram?: string // IG 網址
  youtube?: string // YT 網址
  tokenList?: Array<string> // 驗證
}

interface IAccount {
  account: string
  password: string
}

export {
  ILogin,
  IRegister,
  IUser,
  IAccount
}