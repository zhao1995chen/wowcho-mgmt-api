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
  GENERAL: 'Please vheck your data.',
  CORS: 'CORS',
  PERMISSION_DENIED: 'Permission denied.',
  REQUIRED: 'fieldName is required.',
  NOT_CHANGED: 'fieldName is not changed.',
  ERROR_FORMAT: 'filedName does not match the format.',
  DUPLICATE: 'fieldValue is already taken.',
  INVALID: 'fieldName is invalid'
}

const HASH_TIME = 12

export {
  HEADERS,
  METHOD,
  ERROR,
  HASH_TIME
}