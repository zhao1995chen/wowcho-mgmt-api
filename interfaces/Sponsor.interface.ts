// 贊助相關
// 不同 interface 想拆開也可以，這裡先做多個 interface 的示範

enum OrderStatus {
  Null = -1, // null
  Established = 0, // 已成立
  Cancel = 1, // 已取消
  Paid = 2, // 已付款
}

enum ShippingStatus {
  Null = -1, // null
  Shipped = 0, // 已出貨
  NotShipped = 1, // 未出貨
}

interface ISponsor {
  id: string // 贊助訂單編號
  orderPlanId: string // 方案 id
  orderSpecification: Array<String> // 規格
  freight: number // 運費
  totalMoney: number // 總金額
  orderStatus: 0 | 1 | 2 // 訂單狀態
  shippingStatus: 0 | 1 // 出貨狀態
  messageIdList: Array<String> // 贊助留言列表
  payWay: string // 付費方式
  logistics: string // 取貨方式
  note: string // 訂單備註
  recipientName: string // 收件人姓名
  recipientPhone: string // 收件人電話
  recipientWay: string // 收件方式
  recipientShop: string // 收件店家名稱
  recipientShopId: string // 收件店家 ID
  recipientTrackingId: string // 收件追蹤編號
  recipientAddress: string // 收店地址
  createTime?: number // 訂單建立時間 (?)
  updateTime?: number // 訂單更新時間 v

  // date: number // 訂單成立日期 (?)
  // projectTitle: string // 贊助專案名稱 v

  // 購買人名稱
  // 會員編號

  // orderNumber: string // 訂單編號
  // projectName: string // 募資活動名稱
  // purchaserName: string // 購買人名稱
  // memberNumber: string // 會員編號
  // purchaseDate: number // 購買日期
  // price: number // 價格
  // payment: string // 付款方式
  // lastUpdateTime: number // 最後更新時間
}

export {
  ISponsor,
}