// 會員相關
import { Schema, model } from 'mongoose'
import { ISponsor } from '../interfaces/Sponsor.interface'
import validator from 'validator'

const SponsorSchema = new Schema<ISponsor>(
  // 藍新金流所需
  {
    ItemDesc: {
      type: String,
      required: [true, '缺少商品名稱'],
      select: true
    },
    Amt: {
      type: Number,
      required: [true, '缺少訂單金額'],
      select: true
    },
    Email: {
      type: String,
      required: [true, '請輸入付款人 Email'],
      // lowercase: true,
      select: true,
      validate: {
        validator (value) {
          return validator.isEmail(value)
        },
        message: '必須是 Email 格式'
      },
    },
    TimeStamp: {
      type: Number,
      select: false
    },
    MerchantOrderNo: {
      type: String,
      default: '',
      // required: [true, '缺少商店訂單編號'],
      select: true
    },
    CVSCOM: {
      type: Number,
      enum:[0,1,2,3],   //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
      required: [false, '物流啟用'],
      select: true
    },
    CREDIT: {
      type: Number,
      enum:[0,1],   //物流啟用 店到店物流啟用 1 = 啟用超商取貨不付款 2 = 啟用超商取貨付款 3 = 啟用超商取貨不付款及超商取貨付款 0 或者未有此參數，即代表不開啟
      required: [false, '信用卡一次付清啟用'],
      select: true
    },
    TradeSha: {
      type: String,
      default: '',
      // required: [true, '缺少SHA256 加密'],
      select: true
    },
    TradeInfo: {
      type: String,
      default: '',
      // required: [true, '缺少AES加密 加密'],
      select: true
    },
    MerchantID: {
      type: String,
      // required: [true, '缺少商店代號'],
      select: true
    },
    Version: {
      type: String,
      default: '2.0',
    },
    RespondType:{
      type: String,
      default: 'JSON',
    },
    // 藍新交易成功後回傳
    // 交易成功基本參數
    IP: String, //付款人交易IP
    TradeNo: Number, //藍新金流交易序號
    EscrowBank: String, //款項保管銀行 
    PaymentType: String, //支付方式，信用卡: CREDIT 、 店到店: CVSCOM
    RespondCode: String, //金融機構回應碼
    // 信用卡一次付清 CREDIT
    Auth: String, //收單機構授權碼
    Card6No: String, //卡號前六碼
    Card4No: String, //卡號末四碼
    AuthBank: String, //收單金融機構
    PayTime: String, //支付完成時間 回傳格式為:2014-06-25 16:43:49, 超商取貨以空值回傳
    PaymentMethod: String, //交易類別
    // 物流店到店 CVSCOM
    StoreCode: String, //超商取貨門市編號
    StoreType: String, //超商類別名稱
    StoreName: String, //超商取貨門市名稱
    TradeType: String, //取件交易方式
    StoreAddr: String, //取貨人姓名
    CVSCOMName: String, //取貨人姓名
    CVSCOMPhone: String, //取貨人手機號碼
    LgsType: String, //物流型態 'B2C','C2C'
    LgsNo: String, //物流寄件單號(寄件代碼)
    // 渦潮自己資料庫需要欄位，新建時觸發 
    buyerId :{ // 購買人 ID
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    ownerId: { // 購買專案的提案人 ID
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    planId: { // 方案 ID
      type: Schema.Types.ObjectId,
      ref: 'plan'
    },
    proposalId :{
      type: Schema.Types.ObjectId,
      ref: 'proposal'
    },
    payStatus: { // 是否付款
      type: Boolean,
      default: false,
    },
    // projectTitle: { // 專案名稱
    //   type: String,
    //   default: '',
    //   required: [true, '方案名稱為必填'],
    // },
    remark: { // 備註
      type: String,
      default: '',
    },
    option :{ // 方案規格
      type: []
    },
    address:{ //方案地址
      type: String,
      default: '',
    }
    // orderSpecification: [ specificationSchema ]
    // ReturnURL: {
    //   type: String,
    //   required: [false, '返回商店網址'],
    //   select: true
    // },
    // NotifyURL: {
    //   type: String,
    //   required: [false, '支付通知網址'],
    //   select: true
    // },
  },
  {
    versionKey: false,
    timestamps: true
  }
)

const Sponsor = model<ISponsor>('sponsor', SponsorSchema)

export {
  Sponsor,
  SponsorSchema
}