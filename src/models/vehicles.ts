import { Schema, model, type Document } from 'mongoose'

interface VehicleInfo {
  carMake: string
  carModel: string
  carModelYear: string
  carManufacturer: string
  carMetadata: Record<string, string | null>
}

interface VehiclesType extends Document {
  carMake: string
  carModel: string
  carModelYear: number
  carManufacturer: string
  carVin: string
  carMetadata: Record<string, string | null>
  organization: Schema.Types.ObjectId
}

const VehiclesSchema: Schema = new Schema({
  carMake: { type: String, required: true },
  carModel: { type: String, required: true },
  carModelYear: { type: Number, required: true },
  carManufacturer: { type: String, required: true },
  carVin: { type: String, required: true },
  carMetadata: { type: Map, of: String, default: {} },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
})

VehiclesSchema.set('toJSON', {
  transform: function (_doc, ret, _options) {
    delete ret.__v
    return ret
  }
})

const Vehicle = model<VehiclesType>('Vehicle', VehiclesSchema)

export { Vehicle, type VehiclesType, type VehicleInfo }
