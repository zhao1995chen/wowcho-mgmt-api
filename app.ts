import express from 'express'
import cors from 'cors' 

import { uploadRouter } from './routes/Upload.route'
import { userRouter } from './routes/User.route'
import { registerRouter } from './routes/Register.route'

const app = express()

app.use(express.json())
app.use(cors())

// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)

app.use('/profile', userRouter)
app.use('/register', registerRouter)

export default app