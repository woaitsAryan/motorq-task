/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Organization, type OrganizationType } from '@/models/organization'
import { type orgPatchDtoType, type orgCreateDtoType, type getAllOrgParamsType } from './org.dto'
import { ErrorBadRequest } from '@/helpers/errors'
import logger from '@/loaders/logger'
import { canPatchFuelReimbursementPolicy } from '@/helpers/db'

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
    logger.info('Created organization: ' + newOrganization.name)
    await newOrganization.save()

    return newOrganization
  },

  Patch: async (orgPatchDto: orgPatchDtoType, orgId: string): Promise<OrganizationType> => {
    // const session = await startSession()
    // session.startTransaction()
    // const existingOrg = await Organization.findById(orgId).session(session)
    const existingOrg = await Organization.findById(orgId)
    if (existingOrg == null) {
      throw new ErrorBadRequest('Organization not found')
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (orgPatchDto.fuelReimbursementPolicy !== undefined) {
      if (!await canPatchFuelReimbursementPolicy(existingOrg._id as any, orgPatchDto.fuelReimbursementPolicy)) {
        throw new ErrorBadRequest('Cannot patch fuel reimbursement policy')
      }
      existingOrg.fuelReimbursementPolicy = orgPatchDto.fuelReimbursementPolicy
    }
    if (orgPatchDto.account !== undefined) {
      existingOrg.account = orgPatchDto.account
    }
    if (orgPatchDto.website !== undefined) {
      existingOrg.website = orgPatchDto.website
    }

    if (orgPatchDto.speedLimitPolicy !== undefined) {
      existingOrg.speedLimitPolicy = orgPatchDto.speedLimitPolicy
    }

    // await existingOrg.save({ session })
    // await session.commitTransaction()
    // await session.endSession()
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
