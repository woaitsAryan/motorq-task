import { Organization, type OrganizationType } from '../src/models/organization'
import connectToDB from '../src/loaders/db'
import { getValidSpeedLimitPolicy, getValidFuelReimbursementPolicy, canPatchFuelReimbursementPolicy } from '../src/helpers/db'
const fuelChange = async () => {
  await connectToDB()
  console.log('Changing fuel reimbursement policy...')
  const newOrg1 = await Organization.findOne({ name: 'OrgTest1' })
  const newOrg2 = await Organization.findOne({ name: 'OrgTest2' })
  const newOrg3 = await Organization.findOne({ name: 'OrgTest3' })
  if (!newOrg1 || !newOrg2 || !newOrg3) {
    console.log('Organization not found')
    return
  }
  console.log('Org 1 fuel policy', newOrg1.fuelReimbursementPolicy)
  console.log('Org 2 fuel policy',  newOrg2.fuelReimbursementPolicy)
  console.log('Org 3 fuel policy', newOrg3.fuelReimbursementPolicy)

  newOrg1.fuelReimbursementPolicy = '1250'
  await newOrg1.save()

  console.log('Org 2 fuel policy now', await getValidFuelReimbursementPolicy(newOrg2._id as any))
  console.log('Org 3 fuel policy now', await getValidFuelReimbursementPolicy(newOrg3._id as any))
  console.log('Can org 2 be patched now?', await canPatchFuelReimbursementPolicy(newOrg2._id as any))
}

fuelChange()
