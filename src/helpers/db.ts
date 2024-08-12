/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Organization, type OrganizationType } from '@/models/organization'
import type mongoose from 'mongoose'

async function getValidFuelReimbursementPolicy (orgId: mongoose.Types.ObjectId): Promise<string | null> {
  let currentOrg: OrganizationType | null = await Organization.findById(orgId)

  while (currentOrg !== null) {
    if (currentOrg.fuelReimbursementPolicy !== null) {
      return currentOrg.fuelReimbursementPolicy
    }
    currentOrg = currentOrg.parent ? await Organization.findById(currentOrg.parent) : null
  }

  return null
}

async function getValidSpeedLimitPolicy (orgId: mongoose.Types.ObjectId): Promise<string | null> {
  let currentOrg: OrganizationType | null = await Organization.findById(orgId)

  while (currentOrg !== null) {
    if (currentOrg.speedLimitPolicy !== null) {
      return currentOrg.speedLimitPolicy
    }
    currentOrg = currentOrg.parent ? await Organization.findById(currentOrg.parent) : null
  }

  return null
}

async function canPatchFuelReimbursementPolicy (orgId: mongoose.Types.ObjectId): Promise<boolean> {
  let currentOrg: OrganizationType | null = await Organization.findById(orgId)

  while (currentOrg !== null) {
    if (currentOrg.fuelReimbursementPolicy !== null) {
      return true
    }
    currentOrg = currentOrg.parent ? await Organization.findById(currentOrg.parent) : null
  }

  return false
}

export { getValidFuelReimbursementPolicy, getValidSpeedLimitPolicy, canPatchFuelReimbursementPolicy }
