import { Response } from 'express'
import { ERROR, HEADERS } from '../const'

export interface IError {
  code?: number
  message: string
  fieldName?: string
  fieldValue?: string
  type?: string // custom 、validate
  validateMessage: validateMessage
}
interface validateMessage {
  errors: errors
}
interface errors {
  message: string
}

export const errorHandler = (res: Response, e: IError) => {
  const { code, fieldName, fieldValue, type = 'custom', validateMessage } = e
  let { message } = e
  // 一般錯誤
  if (type === 'custom') {
    if (message) {
      if (message.includes('fieldName') && fieldName) message = message.replace('fieldName', fieldName)
      if (message.includes('fieldValue') && fieldValue) message = message.replace('fieldValue', fieldName)
    } else {
      message = ERROR.GENERAL
    }
  } else if (type === 'validate') {  //使用 validateSync 的錯誤
    const errorMessages = Object.values(validateMessage.errors).map((err) => err.message)
    message = errorMessages.join(', ')
  }
  res.set(HEADERS).status(code || 400).send(
    JSON.stringify({
      status: 'Failed',
      message
    })
  ).end()
}
