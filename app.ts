import express from 'express'

import { userRouter } from './routes/User.route'

const app = express()

app.use('/profile', userRouter)

export default app