import { Router } from 'express'
import { VehicleController } from './vehicle.controller'

const vehicleRouter = Router()

export default (app: Router): void => {
  app.use('/vehicles', vehicleRouter)

  vehicleRouter.post('/', VehicleController.Create)
  vehicleRouter.get('/decode/:vin', VehicleController.FetchVehicleDetails)
  vehicleRouter.get('/:vin', VehicleController.FetchVehicleByVin)
}
