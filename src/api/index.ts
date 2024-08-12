import { Router } from 'express'
import org from './routes/org'
import vehicle from './routes/vehicle'

export default (): Router => {
  const app = Router()
  org(app)
  vehicle(app)

  return app
}
