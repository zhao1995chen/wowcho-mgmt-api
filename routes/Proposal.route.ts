import express from 'express'

import { isAuth } from '../middlewares/Auth.middleware'
import { ProposalController } from '../controllers/Proposal.controller'

export const proposalRouter = express.Router()

proposalRouter.get('/', isAuth, ProposalController.getList)
proposalRouter.post('/', isAuth, ProposalController.create)