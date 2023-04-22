import { Request, Response } from 'express'
import admin from '../connections/firebase'
import { v4 as uuidv4 } from 'uuid'
import { GetSignedUrlConfig } from '../interfaces/Upload.interface'
import { errorHandler } from '../services/errorHandler'
import { successHandler } from '../services/successHandler'

export const UploadController = {
  async upload(req: Request, res: Response) {
    try {
      const bucket = admin.storage().bucket()
      // 取得上傳的檔案
      const file = req.file
      // 建立 blob 物件
      const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`)
      // 建立可以寫入 blob 的物件
      const blobStream = blob.createWriteStream()

      // console.log(blobStream)

      blobStream.on('finish', () => {
        const config: GetSignedUrlConfig = {
          action: 'read', // 權限
          expires: '12-31-2500', // 網址的有效期限
        }
        // 取得檔案的網址
        blob.getSignedUrl(config, (_err, imgUrl) => {
          successHandler(res, { imgUrl })
        })

        
      })

      blobStream.on('error',  () => {
        throw '上傳失敗'
      })

      // 實際寫入檔案的執行
      blobStream.end(file.buffer)
    } catch(e) {
      errorHandler(res, e)
    }
  },
}