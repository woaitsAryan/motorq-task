import { type VehicleInfo } from '@/models/vehicles'
import { fetchVehicleDetailsFromCache, setVehicleDetailsToCache } from './cache'

const fetchVinDetails = async (vin: string): Promise<VehicleInfo> => {
  const cachedData = await fetchVehicleDetailsFromCache(vin)
  if (cachedData != null) {
    return cachedData
  }

  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)
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

  return vehicleInfo
}

export { fetchVinDetails }
