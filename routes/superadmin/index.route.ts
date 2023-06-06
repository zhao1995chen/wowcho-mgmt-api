import express from 'express'
import { proposalRouter } from './Proposal.route'

export const superAdminRouter = express.Router()

superAdminRouter.use('/proposal', proposalRouter)
