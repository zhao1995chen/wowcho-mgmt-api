import express from 'express'

import { isAuth } from '../middlewares/Auth.middleware'
import { ProposalController } from '../controllers/Proposal.controller'

export const proposalRouter = express.Router()

// Proposal.get('/', isAuth, ProfileController.get)
proposalRouter.post('/', isAuth, ProposalController.create)