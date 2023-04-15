// 會員相關

import express from 'express'
import { UserController } from '../controllers/User.controller'

export const userRouter = express.Router()

userRouter.get('/', UserController.get)
userRouter.post('/', UserController.update)
