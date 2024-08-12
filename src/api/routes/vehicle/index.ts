import { Router } from 'express'
import { VehicleController } from './vehicle.controller'
import ratelimit from '@/api/middlewares/ratelimit'
import protect from '@/api/middlewares/protect'

const vehicleRouter = Router()

export default (app: Router): void => {
  app.use('/vehicles', protect, vehicleRouter)

  vehicleRouter.post('/', VehicleController.Create)
  vehicleRouter.get('/decode/:vin', ratelimit, VehicleController.FetchVehicleDetails)
  vehicleRouter.get('/:vin', VehicleController.FetchVehicleByVin)
}
