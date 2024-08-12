import { z } from 'zod'

const orgCreateDto = z.object({
  name: z.string(),
  account: z.string(),
  website: z.string(),
  fuelReimbursementPolicy: z.string().default('1000'),
  speedLimitPolicy: z.string()
})

const orgPatchDto = z.object({
  account: z.string().optional(),
  website: z.string().optional(),
  fuelReimbursementPolicy: z.string().optional(),
  speedLimitPolicy: z.string().optional()
})

const getAllOrgParams = z.object({
  limit: z.preprocess((val) => parseInt(val as string, 10), z.number().default(10)),
  page: z.preprocess((val) => parseInt(val as string, 10), z.number().default(1))
})

type getAllOrgParamsType = z.infer<typeof getAllOrgParams>
type orgCreateDtoType = z.infer<typeof orgCreateDto>
type orgPatchDtoType = z.infer<typeof orgPatchDto>

export { orgCreateDto, getAllOrgParams, type orgCreateDtoType, orgPatchDto, type orgPatchDtoType, type getAllOrgParamsType }
