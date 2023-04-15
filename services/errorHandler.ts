import { Response } from 'express'
import { HEADERS } from '../const'

export const errorHandler = (res: Response, e?: any) => {
  res.writeHead(404, HEADERS)
  res.write(JSON.stringify({
    status: 'Failed',
    message: e?.message || e
  }))
  res.end()
}
