import { Organization, type OrganizationType } from '../src/models/organization'
import connectToDB from '../src/loaders/db'

const fuelChange = async () => {
  await connectToDB()
  console.log('Seeding organizations...')
  const newOrg1 = await Organization.findOne({ name: 'OrgTest1' })
  if (!newOrg1) {
    console.log('Organization not found')
    return
  }
  newOrg1.fuelReimbursementPolicy = '1500'
  await newOrg1.save()
}

fuelChange()
