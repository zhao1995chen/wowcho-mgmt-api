import express from 'express'
import { ProposalController } from '../../controllers/superadmin/Proposal.controller'
import { isAuth } from '../../middlewares/Auth.middleware'

export const proposalRouter = express.Router()

proposalRouter
  .get('/', isAuth, ProposalController.get)
  .patch('/', isAuth, ProposalController.update)
  .delete('/', isAuth, ProposalController.delete)