// 贊助相關

import express from 'express'
import { SponsorController } from '../controllers/Sponsor.controller'

export const sponsorRouter = express.Router()

sponsorRouter.get('/', SponsorController.getList)
sponsorRouter.get('/details', SponsorController.get)
