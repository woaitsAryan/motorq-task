import { Organization, type OrganizationType } from '../src/models/organization'
import connectToDB from '../src/loaders/db'
import { getValidSpeedLimitPolicy, getValidFuelReimbursementPolicy, canPatchFuelReimbursementPolicy } from '../src/helpers/db'
const speedLimit = async () => {
  await connectToDB()
  console.log('Changing speed limits...')
  const newOrg1 = await Organization.findOne({ name: 'OrgTest1' })
  const newOrg2 = await Organization.findOne({ name: 'OrgTest2' })
  const newOrg3 = await Organization.findOne({ name: 'OrgTest3' })
  if (!newOrg1 || !newOrg2 || !newOrg3) {
    console.log('Organization not found')
    return
  }
  console.log('Org 1 speed limit', newOrg1.speedLimitPolicy)
  console.log('Org 2 speed limit',  newOrg2.speedLimitPolicy)
  console.log('Org 3 speed limit', newOrg3.speedLimitPolicy)

  newOrg1.speedLimitPolicy = '250'
  await newOrg1.save()

  console.log('Org 2 speed limit now', await getValidSpeedLimitPolicy(newOrg2._id as any))
  console.log('Org 3 speed limit now', await getValidSpeedLimitPolicy(newOrg3._id as any))
}

speedLimit()
