import { ServerResponse } from 'http'
import { HEADERS } from '../const'

export const successHandler = (res: ServerResponse, data?: object) => {
  res.writeHead(200, HEADERS)
  res.write(JSON.stringify({
    status: 'Success',
    data
  }))
  res.end()
}