import { z } from 'zod'

const createVehicleDto = z.object({
  vin: z.string().length(17).regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN must be a 17-character alphanumeric string without I, O, or Q'
  }),
  orgId: z.string({ message: 'Org ID is required' })
})

type createVehicleDtoType = z.infer<typeof createVehicleDto>

export { createVehicleDto, type createVehicleDtoType }
