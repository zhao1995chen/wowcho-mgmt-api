import express from 'express'
import { PlacardController } from '../controllers/Placard.controller'

export const placardRoute = express.Router()

placardRoute.get('/details', PlacardController.get)
placardRoute.get('/', PlacardController.getList)
placardRoute.post('/', PlacardController.create)
placardRoute.patch('/', PlacardController.update)
placardRoute.delete('/', PlacardController.delete)
