import jwt from "jsonwebtoken"
import EmailTokenModel from "../../../models/Token"
import UserModel from "../../../models/Users"
import axios from "axios"
import crypto from "crypto"
import cookie from "cookie"

const resend = async (req, res) => {
  try {
    const jwtToken = cookie.parse(req.headers.cookie).jwtToken
    if (!jwtToken)
      return res
        .status(400)
        .json({ info: { message: "something went wrong!", status: "Error" } })
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)

    const user = await UserModel.findById(_id)
    if (!user)
      return res
        .status(400)
        .json({ info: { message: "something went wrong!", status: "Error" } })
    if (user.verified)
      return res.status(200).json({
        info: { message: "You're already verified!", status: "Success" },
      })

    let emailToken
    const foundToken = await EmailTokenModel.findOne({ userId: _id })
    if (foundToken) emailToken = foundToken
    // here we create another token incase user's past token expired
    else
      emailToken = await EmailTokenModel.create({
        userId: _id,
        token: crypto.randomBytes(32).toString("hex"),
      })

    await axios.post(
      `${process.env.BASE_URL}/api/verification/sendVerificationEmail`,
      { emailToken }
    )
    res
      .status(200)
      .json({ info: { message: "Email sent Successfully", status: "Pending" } })
  } catch (e) {
    res.status(400).send({
      info: {
        message:
          "something went wrong click the 'Resend' Button or try again later",
        status: "Error",
      },
    })
  }
}

export default resend
