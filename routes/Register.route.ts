import express from 'express'
import { RegisterController } from '../controllers/Register.controller'


export const registerRouter = express.Router()

registerRouter.post('/', RegisterController.create)