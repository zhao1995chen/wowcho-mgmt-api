import express from 'express'

import { isAuth } from '../middlewares/Auth.middleware'
import { DashboardController } from '../controllers/Dashboard.controller'

export const dashboardRouter = express.Router()
dashboardRouter.get('/', isAuth, DashboardController.get)
