import { HEADERS } from '../const'
import { Response } from 'express'

export const successHandler = (res: Response, data?: object) => {
  res.set(HEADERS).status(200).send(
    JSON.stringify({
      status: 'Success',
      data
    })
  ).end()
}