import express from 'express'
import { LoginController } from '../controllers/Login.controller'

export const loginRouter = express.Router()

loginRouter.post('/', LoginController.login)
loginRouter.post('/oauth', LoginController.oauthLogin)
loginRouter.post('/superadmin', LoginController.superAdminLogin)
