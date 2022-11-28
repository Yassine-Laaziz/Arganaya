import UserModel from "../../../../models/Users"
import { connect } from "../../../../lib/mongodb"
import { createToken, verify } from "../../../../lib/jwt"

const verificationPage = async (req, res) => {
  try {
    connect()
    const { emailToken } = req.body
    const { payload } = await verify(req.cookies.jwtToken)
    const { user, verified } = payload

    if (!user || !emailToken) {
      return res.status(400).json({
        message:
          "Something went wrong, please do not modify the link, in case you don't have one click 'Resend' and check you email",
        status: "Error",
      })
    }

    const alreadyExists = await UserModel.findOne({ email: user.email })
    if (alreadyExists || verified)
      return res
        .status(200)
        .json({ message: "You're already verified!", status: "Success" })

    const newUser = await UserModel.create(user)
    
    // updating token to include "verified: true", we'll use this in middleware
    const { serialized } = await createToken({ signedUp: true, verified: true, user: newUser })
    res.setHeader("Set-Cookie", serialized)

    res
      .status(200)
      .json({ message: "Email verified successfully!", status: "Success" })
  } catch (e) {
    res.status(400).json({
        message:
          "Something went wrong, please do not modify the link, in case you don't have one click 'Resend' and check you email",
        status: "Error",
      }
    )
  }
}

export default verificationPage
