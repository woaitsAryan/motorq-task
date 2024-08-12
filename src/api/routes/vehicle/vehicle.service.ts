import { fetchVinDetails } from '@/helpers/vin'
import { type createVehicleDtoType } from './vehicle.dto'
import { Vehicle, type VehiclesType, type VehicleInfo } from '@/models/vehicles'
import { ErrorNotFound } from '@/helpers/errors'

export const VehicleService = {
  Create: async (createVehicleDto: createVehicleDtoType): Promise<VehiclesType> => {
    const existingOrg = await Vehicle.findOne({ org: createVehicleDto.org })

    if (existingOrg == null) {
      throw new ErrorNotFound('Organization doesn\'t exist')
    }

    const vinData = await fetchVinDetails(createVehicleDto.vin)

    const newVehicle = new Vehicle({
      vin: createVehicleDto.vin,
      org: createVehicleDto.org,
      make: vinData.carMake,
      model: vinData.carModel,
      year: vinData.carModelYear,
      manufacturer: vinData.carManufacturer,
      metadata: vinData.carMetadata
    })
    await newVehicle.save()
    return newVehicle
  },
  FetchDetails: async (vinNumber: string): Promise<VehicleInfo> => {
    const vinData = await fetchVinDetails(vinNumber)
    return vinData
  },
  FetchVehicleByVin: async (vin: string): Promise<VehiclesType> => {
    const vehicle = await Vehicle.findOne({ vin })
    if (vehicle == null) {
      throw new ErrorNotFound('Vehicle not found')
    }
    return vehicle
  }
}
