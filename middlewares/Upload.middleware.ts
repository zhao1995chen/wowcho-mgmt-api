import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'
import { File } from '../interfaces/Upload.interface'


const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req: Request, file: File, cb: FileFilterCallback) {
    // 非圖檔
    if (!file.originalname.match(/\.(jpe?g|png|svg|gif)$/)) cb(new Error('請上傳正確的檔案格式'))
    // 圖片
    cb(null, true)
  }
})

export {
  upload
}