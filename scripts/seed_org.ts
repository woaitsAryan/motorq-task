import { Organization, type OrganizationType } from '../src/models/organization'
import connectToDB from '../src/loaders/db'

const seedOrgs = async () => {
  await connectToDB()
  console.log('Seeding organizations...')
  const newOrg = new Organization({
    name: 'OrgTest1',
    account: 'OrgTestAcc1',
    website: 'www.orgtest1.com',
    fuelReimbursementPolicy: '1000',
    speedLimitPolicy: '50',
  })

  await newOrg.save()

  const newOrg2 = new Organization({
    name: 'OrgTest2',
    account: 'OrgTestAcc2',
    website: 'www.orgtest2.com',
    fuelReimbursementPolicy: '2000',
    speedLimitPolicy: '60',
    parent: newOrg._id,
  })
  newOrg.children.push(newOrg2._id)
  await newOrg.save()
  await newOrg2.save()

  const newOrg3 = new Organization({
    name: 'OrgTest3',
    account: 'OrgTestAcc3',
    website: 'www.orgtest3.com',
    fuelReimbursementPolicy: '3000',
    speedLimitPolicy: '70',
    parent: newOrg._id,
  })

  newOrg.children.push(newOrg3._id)
  await newOrg.save()
  await newOrg3.save()

}

seedOrgs()
