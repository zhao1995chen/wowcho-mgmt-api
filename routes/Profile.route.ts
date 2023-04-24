import express from 'express'

import { isAuth } from '../middlewares/Auth.middleware'
import { ProfileController } from '../controllers/Profile.controller'

export const profileRouter = express.Router()

profileRouter.get('/', isAuth, ProfileController.get)
profileRouter.patch('/', isAuth, ProfileController.update)