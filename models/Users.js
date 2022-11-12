import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  fullName: { type: String, required: true },
  number: { type: Number, required: true },
  email: { type: String, required: true }, // i'm not going to use "unique" here
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
})

const UserModel = models.user || model("user", UserSchema)

export default UserModel
