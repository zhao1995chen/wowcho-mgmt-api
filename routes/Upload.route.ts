import express from 'express'
import { upload } from '../middlewares/Upload.middleware'
import { UploadController } from '../controllers/Upload.controller'

export const uploadRouter = express.Router()

// TODO 等會員功能好了之後，上傳前要加會員身份驗證
uploadRouter.post('/', upload.single('file'), UploadController.upload)