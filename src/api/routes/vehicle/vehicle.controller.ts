import catchAsync from '../../../helpers/catchAsync'
import type { Response, Request } from 'express'
import { ErrorBadRequest } from '../../../helpers/errors'
import { createVehicleDto } from './vehicle.dto'
import { VehicleService } from './vehicle.service'

export const VehicleController = {
  Create: catchAsync(
    async (req: Request, res: Response) => {
      const validatedBody = createVehicleDto.safeParse(req.body)
      if (!validatedBody.success) {
        throw new ErrorBadRequest('Invalid input')
      }

      const newVehicle = await VehicleService.Create(validatedBody.data)
      return res.json({ message: 'Vehicle successfully created!', data: newVehicle, success: true })
    }
  ),
  FetchVehicleDetails: catchAsync(
    async (req: Request, res: Response) => {
      const { vin } = req.params

      const vinData = await VehicleService.FetchDetails(vin)
      return res.json({ message: 'Vehicle details fetched!', data: vinData, success: true })
    }
  ),
  FetchVehicleByVin: catchAsync(
    async (req: Request, res: Response) => {
      const { vin } = req.params
      const vehicle = await VehicleService.FetchVehicleByVin(vin)
      return res.json({ message: 'Vehicle fetched!', data: vehicle, success: true })
    }
  )
}
