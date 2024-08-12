import { Router } from 'express'
import { OrgController } from './org.controller'
import protect from '@/api/middlewares/protect'

const orgRouter = Router()

export default (app: Router): void => {
  app.use('/orgs', protect, orgRouter)

  orgRouter.post('/', OrgController.Create)
  orgRouter.patch('/:orgId', OrgController.Patch)
  orgRouter.get('/', OrgController.GetAll)
  orgRouter.get('/:orgId', OrgController.GetOne)
}
