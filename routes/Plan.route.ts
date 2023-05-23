import express from 'express'
import { PlanController } from '../controllers/Plan.controller'
import { isAuth } from '../middlewares/Auth.middleware'

export const planRouter = express.Router()

planRouter.post('/', isAuth, PlanController.create)
planRouter.patch('/', isAuth, PlanController.update)
planRouter.get('/', isAuth, PlanController.getList)
planRouter.get('/details', isAuth, PlanController.get)
planRouter.get('/spec', isAuth, PlanController.getSpecification)

planRouter.delete('/', isAuth, PlanController.delete)
