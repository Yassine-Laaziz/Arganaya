import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  number: { type: Number, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
})

const UserModel = models.user || model("user", UserSchema)

export default UserModel
