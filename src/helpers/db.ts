/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Organization, type OrganizationType } from '@/models/organization'
import type mongoose from 'mongoose'

async function getValidFuelReimbursementPolicy (orgId: mongoose.Types.ObjectId): Promise<string | null> {
  const currentOrg: OrganizationType | null = await Organization.findById(orgId)
  if (!currentOrg) {
    return null
  }
  if (currentOrg.inheritedFuelReimbursementPolicy) {
    return currentOrg.inheritedFuelReimbursementPolicy
  }
  return currentOrg.fuelReimbursementPolicy
}

async function getValidSpeedLimitPolicy (orgId: mongoose.Types.ObjectId): Promise<string | null> {
  const currentOrg: OrganizationType | null = await Organization.findById(orgId)
  if (!currentOrg) {
    return null
  }
  return currentOrg.speedLimitPolicy
}

async function canPatchFuelReimbursementPolicy (orgId: mongoose.Types.ObjectId, currentFuelReimbursementPolicy: string): Promise<boolean> {
  const currentOrg: OrganizationType | null = await Organization.findById(orgId)
  if (!currentOrg) {
    return false
  }
  if (currentOrg.fuelReimbursementPolicy === currentFuelReimbursementPolicy || currentOrg.inheritedFuelReimbursementPolicy === currentFuelReimbursementPolicy) {
    return true
  }
  if (currentOrg.inheritedFuelReimbursementPolicy !== null) {
    return false
  }
  return true
}

export { getValidFuelReimbursementPolicy, getValidSpeedLimitPolicy, canPatchFuelReimbursementPolicy }
