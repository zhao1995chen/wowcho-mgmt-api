import express from 'express'
import { FaqController } from '../controllers/Faq.controller'

export const faqRouter = express.Router()

faqRouter.get('/details', FaqController.get)
faqRouter.get('/', FaqController.getList)
faqRouter.post('/', FaqController.create)
faqRouter.patch('/', FaqController.update)
faqRouter.delete('/', FaqController.delete)
