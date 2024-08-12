import { redisClient } from '@/loaders/redis'
import { type VehicleInfo } from '@/models/vehicles'

async function setVehicleDetailsToCache (key: string, vehicleInfo: VehicleInfo): Promise<void> {
  if (redisClient == null || redisClient.status !== 'ready') {
    return
  }
  await redisClient.set(key, JSON.stringify(vehicleInfo))
}

async function fetchVehicleDetailsFromCache (key: string): Promise<VehicleInfo | null> {
  if (redisClient == null || redisClient.status !== 'ready') {
    return null
  }
  const result = await redisClient.get(key)
  if (result == null) {
    return null
  }
  return JSON.parse(result) as VehicleInfo
}

async function clearCache (): Promise<void> {
  if (redisClient == null || redisClient.status !== 'ready') {
    return
  }
  await redisClient.flushdb()
}

export { setVehicleDetailsToCache, fetchVehicleDetailsFromCache, clearCache }
