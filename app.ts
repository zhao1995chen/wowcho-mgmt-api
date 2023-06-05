import cookieParser from 'cookie-parser'
import express from 'express'
import cors from 'cors' 

import { uploadRouter } from './routes/Upload.route'

import { registerRouter } from './routes/Register.route'
import { profileRouter } from './routes/Profile.route'
import { loginRouter } from './routes/Login.route'
import { userRouter } from './routes/User.route'
import { proposalRouter } from './routes/Proposal.route'
import { planRouter } from './routes/Plan.route'
import { businessProfileRouter } from './routes/BusinessProfile.route'
import { sponsorRouter } from './routes/Sponsor.route'

const app = express()
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json())
app.use(cors())

// TODO 先放根目錄提供會員功能還沒好前串接測試，有會員後需要移到各自 API 內
app.use('/upload', uploadRouter)
app.use('/proposal', proposalRouter)
app.use('/plan', planRouter)

app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/profile', profileRouter)
app.use('/business-profile', businessProfileRouter)
app.use('/sponsor', sponsorRouter)

export default app