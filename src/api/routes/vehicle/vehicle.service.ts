import { fetchVinDetails } from '@/helpers/vin'
import { type createVehicleDtoType } from './vehicle.dto'
import { Vehicle, type VehiclesType, type VehicleInfo } from '@/models/vehicles'
import { ErrorNotFound } from '@/helpers/errors'
import { Organization } from '@/models/organization'

export const VehicleService = {
  Create: async (createVehicleDto: createVehicleDtoType): Promise<VehiclesType> => {
    const existingOrg = await Organization.findById(createVehicleDto.orgId)

    if (existingOrg == null) {
      throw new ErrorNotFound('Organization doesn\'t exist')
    }

    const vinData = await fetchVinDetails(createVehicleDto.vin)

    const newVehicle = new Vehicle({
      carMake: vinData.carMake,
      carModel: vinData.carModel,
      carModelYear: vinData.carModelYear,
      carManufacturer: vinData.carManufacturer,
      carVin: createVehicleDto.vin,
      carMetadata: vinData.carMetadata,
      organization: createVehicleDto.orgId
    })
    await newVehicle.save()
    return newVehicle
  },
  FetchDetails: async (vinNumber: string): Promise<VehicleInfo> => {
    const vinData = await fetchVinDetails(vinNumber)
    return vinData
  },
  FetchVehicleByVin: async (vin: string): Promise<VehiclesType> => {
    const vehicle = await Vehicle.findOne({ carVin: vin })
    if (vehicle == null) {
      throw new ErrorNotFound('Vehicle not found')
    }
    return vehicle
  }
}
