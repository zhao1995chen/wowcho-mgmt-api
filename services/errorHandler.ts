import { Response } from 'express'
import { ERROR, HEADERS } from '../const'

export interface IError {
  code?: number
  message: string
  fieldName?: string
  fieldValue?: string
}

export const errorHandler = (res: Response, e: IError) => {
  const { code, message, fieldName, fieldValue } = e

  // key replace
  if (message) {
    if (message.includes('fieldName') && fieldName) message.replace('fileName', fieldName)
    if (message.includes('fieldValue') && fieldValue) message.replace('fileValue', fieldName)
  } else {
    message.replace(null, ERROR.GENERAL)
  }

  res.set(HEADERS).status(code || 400).send(
    JSON.stringify({
      status: 'Failed',
      message: message
    })
  ).end()
}
