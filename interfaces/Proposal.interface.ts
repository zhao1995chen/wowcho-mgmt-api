import { Document, Types } from 'mongoose'

enum eAgeLimit {
  notLimited = 0, // 無限制
	r18 = 1// 18 禁
}
enum eCategory {
  Society = 1,
  Publishing = 2,
  VideoGame = 3,
  Entertainment = 4,
  Life = 5,
  Design = 6,
  Technology = 7,
  Leisure = 8
}

enum eStatus {
	DRAFT, // 草稿
	WAITING_FOR_APPROVAL, // 等待審核
	APPROVED, // 審核通過
	REJECTED, // 審核未通過
	SUSPEND // 停權
}

interface IProposal extends Document {
  _id?: string
	//圖片網址
  image:string, 
	//影片
	video:string,
	//活動名稱
	name:string,
	//活動分類
  category: eCategory
	//活動簡介
	summary:string,
	//活動描述
	description:string 
	//目標金額
	targetPrice:number,
	// 當前集資金額
	nowPrice:number,
	// 當前購買人數
	nowBuyers:number,
	//募資開始時間
	startTime:number,
	//募資結束時間
	endTime: number | null,
	// 年齡限制
	ageLimit:eAgeLimit,
	// 客製化 URL
	customizedUrl:string
	// 狀態 只有審核通過前台會顯示
	status: eStatus
	// 關聯
	// 提案人
	ownerId: Types.ObjectId;
	// 募資方案 ID 列表
	planIdList: Array<Types.ObjectId>;
	// 留言id列表
	messageIdList: Array<Types.ObjectId>;
	// 常見問答id列表
	faqIdList: Array<Types.ObjectId>;
	// 承諾與告示id列表
	// 專案進度 id 
	placardIdList: Array<Types.ObjectId>;
	contact: string;
	risk: string;
	refund: string;
}
interface IProposalDocument extends IProposal {
  pushPlan: (id: Types.ObjectId) => void
  removePlan: (array) => void
	pushFaq: (id: Types.ObjectId) => void
  removeFaq: (array) => void
	pushPlacard: (id: Types.ObjectId) => void
  removePlacard: (array) => void
}

export {
  IProposalDocument,
  IProposal,
  eAgeLimit,
  eCategory,
  eStatus
}