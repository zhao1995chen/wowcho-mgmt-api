import { Response } from 'express'
import { ERROR, HEADERS } from '../const'

export interface IError {
  code?: number
  message: string
  fieldName?: string
  fieldValue?: string
}

export const errorHandler = (res: Response, e: IError) => {
  const { code, fieldName, fieldValue } = e
  let { message } = e
  // key replace
  if (message) {
    if (message.includes('fieldName') && fieldName) message = message.replace('fieldName', fieldName)
    if (message.includes('fieldValue') && fieldValue) message = message.replace('filedValue', fieldName)
  } else {
    message = ERROR.GENERAL
  }

  res.set(HEADERS).status(code || 400).send(
    JSON.stringify({
      status: 'Failed',
      message
    })
  ).end()
}
