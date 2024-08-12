/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose, { Schema, type Document } from 'mongoose'

interface OrganizationType extends Document {
  name: string
  account: string
  website: string
  fuelReimbursementPolicy: string
  speedLimitPolicy: string
  parent: OrganizationType['_id'] | null
  children: Array<OrganizationType['_id']>
  inheritedFuelReimbursementPolicy: string | null
  inheritedSpeedLimitPolicy: string | null
  vehicles: Schema.Types.ObjectId[]
}

const OrganizationSchema: Schema = new Schema({
  name: { type: String, required: true },
  account: { type: String, required: true },
  website: { type: String, required: true },
  fuelReimbursementPolicy: { type: String, default: '1000' },
  speedLimitPolicy: { type: String, default: null },
  parent: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
  children: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  inheritedFuelReimbursementPolicy: { type: String, default: null },
  inheritedSpeedLimitPolicy: { type: String, default: null },
  vehicles: [{ type: Schema.Types.ObjectId, ref: 'Vehicle' }]
})

OrganizationSchema.pre('save', async function (next) {
  const org = this as unknown as OrganizationType

  if (org.parent !== null) {
    const parentOrg: OrganizationType | null = await mongoose.model('Organization').findById(org.parent)
    if (parentOrg !== null) {
      if (parentOrg.fuelReimbursementPolicy !== null || parentOrg.inheritedFuelReimbursementPolicy !== null) {
        org.inheritedFuelReimbursementPolicy = parentOrg.fuelReimbursementPolicy || parentOrg.inheritedFuelReimbursementPolicy
      }

      if (org.speedLimitPolicy == null && (parentOrg.speedLimitPolicy != null || parentOrg.inheritedSpeedLimitPolicy !== null)) {
        org.inheritedSpeedLimitPolicy = parentOrg.speedLimitPolicy || parentOrg.inheritedSpeedLimitPolicy
      }
    }
  }

  next()
})

OrganizationSchema.post('save', async function () {
  const org = this as unknown as OrganizationType

  if (org.fuelReimbursementPolicy !== null || org.inheritedFuelReimbursementPolicy !== null) {
    await mongoose.model('Organization').updateMany(
      { parent: org._id },
      { $set: { inheritedFuelReimbursementPolicy: org.fuelReimbursementPolicy || org.inheritedFuelReimbursementPolicy } }
    )
  }

  if (org.speedLimitPolicy != null || org.inheritedSpeedLimitPolicy != null) {
    await mongoose.model('Organization').updateMany(
      { parent: org._id, speedLimitPolicy: null },
      { $set: { inheritedSpeedLimitPolicy: org.speedLimitPolicy || org.inheritedSpeedLimitPolicy } }
    )
  }
})

OrganizationSchema.set('toJSON', {
  transform: function (_doc, ret, _options) {
    delete ret.__v
    return ret
  }
})

const Organization = mongoose.model<OrganizationType>('Organization', OrganizationSchema)

export { Organization, type OrganizationType }
