import { Organization, type OrganizationType } from '@/models/organization'
import { type orgPatchDtoType, type orgCreateDtoType, type getAllOrgParamsType } from './org.dto'
import { ErrorBadRequest } from '@/helpers/errors'

export const OrgService = {
  Create: async (orgCreateDto: orgCreateDtoType): Promise<OrganizationType> => {
    const existingOrg = await Organization.findOne({ account: orgCreateDto.account })

    if (existingOrg !== null) {
      throw new ErrorBadRequest('Organization with this account already exists')
    }

    const newOrganization = new Organization({
      name: orgCreateDto.name,
      account: orgCreateDto.account,
      website: orgCreateDto.website,
      fuelReimbursementPolicy: orgCreateDto.fuelReimbursementPolicy,
      speedLimitPolicy: orgCreateDto.speedLimitPolicy
    })
    await newOrganization.save()

    return newOrganization
  },

  Patch: async (orgPatchDto: orgPatchDtoType, orgId: string): Promise<OrganizationType> => {
    const existingOrg = await Organization.findById(orgId)

    if (existingOrg == null) {
      throw new ErrorBadRequest('Organization not found')
    }

    existingOrg.website = orgPatchDto.website
    existingOrg.fuelReimbursementPolicy = orgPatchDto.fuelReimbursementPolicy
    existingOrg.speedLimitPolicy = orgPatchDto.speedLimitPolicy

    await existingOrg.save()
    return existingOrg
  },
  GetAll: async (getAllOrgDto: getAllOrgParamsType): Promise<OrganizationType[]> => {
    const skip = (getAllOrgDto.page - 1) * getAllOrgDto.limit
    return await Organization.find({}).limit(getAllOrgDto.limit).skip(skip)
  },
  GetOne: async (orgId: string): Promise<OrganizationType> => {
    const org = await Organization.findById(orgId)
    if (org == null) {
      throw new ErrorBadRequest('Organization not found')
    }
    return org
  }
}
