import express from 'express'

import { userRouter } from './routes/User.route'
import { registerRouter } from './routes/Register.route'

const app = express()

app.use(express.json())

app.use('/profile', userRouter)
app.use('/register', registerRouter)

export default app