const HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
  'Content-Type': 'application/json'
}

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS'
}

const ERROR = {
  // 如果有其他 error message 需求繼續往下新增
  GENERAL: '請確認你的資料是否正確',
  CORS: 'CORS 跨域問題',
  TOKEN_MALFORMED: '憑證資料錯誤',
  TOKEN_EXPIRED: '憑證已過期，請重新登入後操作',
  TOKEN_NOT_BOFORE: '憑證未啟用',
  PERMISSION_DENIED: '請登入後操作',
  REQUIRED: 'fieldName 必填',
  NOT_CHANGED: 'fieldName 沒有改變',
  ERROR_FORMAT: 'filedName 不符合格式',
  DUPLICATE: 'fieldName 已被使用',
  INVALID: 'fieldName 不存在',
  WRONG_DATA: 'fieldName 錯誤',
  OPERATION_FAILED: '操作失敗'
}

const HASH_TIME = 12

export {
  HEADERS,
  METHOD,
  ERROR,
  HASH_TIME
}