import cookieParser from 'cookie-parser'
import express from 'express'

import { userRouter } from './routes/User.route'
import { uploadRouter } from './routes/Upload.route'
import { loginRouter } from './routes/Login.route'

const app = express()

app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json())

// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)

app.use('/profile', userRouter)
app.use('/login', loginRouter)

export default app