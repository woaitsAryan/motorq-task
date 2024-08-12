import { type VehicleInfo } from '@/models/vehicles'
import { fetchVehicleDetailsFromCache, setVehicleDetailsToCache } from './cache'
import { ErrorBadRequest } from './errors'
import constants from '@/config/constants'

const fetchVinDetails = async (vin: string): Promise<VehicleInfo> => {
  const cachedData = await fetchVehicleDetailsFromCache(vin)
  if (cachedData != null) {
    return cachedData
  }

  const response = await fetch(`${constants.vinUrl}/vehicles/DecodeVin/${vin}?format=json`)
  const data = await response.json()
  const parsedVehicleInfo = parseVehicleInfo(data)

  await setVehicleDetailsToCache(vin, parsedVehicleInfo)

  return parsedVehicleInfo
}

function parseVehicleInfo (data: any): VehicleInfo {
  const results = data.Results
  const vehicleInfo: VehicleInfo = {
    carMake: '',
    carModel: '',
    carModelYear: '',
    carManufacturer: '',
    carMetadata: {}
  }

  results.forEach((item: any) => {
    const { Variable, Value } = item

    switch (Variable) {
      case 'Make':
        vehicleInfo.carMake = Value
        break
      case 'Model':
        vehicleInfo.carModel = Value
        break
      case 'Model Year':
        vehicleInfo.carModelYear = Value
        break
      case 'Manufacturer Name':
        vehicleInfo.carManufacturer = Value
        break
      default:
        vehicleInfo.carMetadata[Variable] = Value
    }
  })
  if (vehicleInfo.carMake === null || vehicleInfo.carModel === null || vehicleInfo.carModelYear === null || vehicleInfo.carManufacturer === null) {
    throw new ErrorBadRequest('Invalid VIN')
  }

  return vehicleInfo
}

export { fetchVinDetails }
