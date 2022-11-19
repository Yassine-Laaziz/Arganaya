import EmailTokenModel from "../../../models/Token"
import UserModel from "../../../models/Users"
import { connect } from "../../../lib/mongodb"

const verify = async (req, res) => {
  try {
    connect()
    const { emailToken } = req.body

    const foundEmailToken = await EmailTokenModel.findOne({ token: emailToken })
    if (!foundEmailToken) {
      // when we resend, we create another EmailTokenModel if the old one expired
      return res.status(200).json({
        message: "Your Token expired, click 'Resend' for a new one and check you email",
        status: "Error",
      })
    }

    const user = await UserModel.findById(foundEmailToken.userId)
    if (user.verified)
      return res
        .status(200)
        .json({ message: "You're already verified!", status: "Success" })

    await UserModel.updateOne(
      { _id: foundEmailToken.userId },
      { verified: true }
    )
    await UserModel.deleteMany({ email: user.email, verified: false })
    await EmailTokenModel.deleteMany({ userId: foundEmailToken.userId })

    res
      .status(200)
      .json({ message: "Email verified successfully!", status: "Success" })
  } catch (error) {
    res.status(400).json(
      error || {
        message:
          "Something went wrong, please do not modify the link, in case you don't have one click 'Resend' and check you email",
        status: "Error",
      }
    )
  }
}

export default verify
