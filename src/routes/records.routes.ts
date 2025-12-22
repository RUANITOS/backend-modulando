import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { createRecord, listMyRecords } from '../controllers/records.controller'

const router = Router()

router.post('/', authMiddleware, createRecord)
router.get('/', authMiddleware, listMyRecords)

export default router
