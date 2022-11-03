import { Schema, model, models } from "mongoose"

const emailTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    unique: true,
  },
  token: {type: String, required: true},
  createdAt: {type: Date, default: Date.now(), expires: '150m'}
})

const EmailTokenModel = models.emailToken || model("emailToken", emailTokenSchema)

export default EmailTokenModel