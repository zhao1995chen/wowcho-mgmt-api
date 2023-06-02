import express from 'express'

import { isAuth } from '../middlewares/Auth.middleware'
import { BusinessController } from '../controllers/BusinessProfile.controller'

export const businessProfileRouter = express.Router()

businessProfileRouter.get('/', isAuth, BusinessController.get)
businessProfileRouter.patch('/', isAuth, BusinessController.update)