import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
})

const UserModel = models.user || model("user", UserSchema)

export default UserModel
