import jwt from "jsonwebtoken"
import EmailTokenModel from "../../../models/Token"
import UserModel from "../../../models/Users"
import axios from "axios"
import crypto from 'crypto'

const resend = async (req, res) => {
  try {
    const jwtToken = await JSON.parse(req.body.jwtToken)
    if (!jwtToken) return res.status(400).send("something went wrong!")
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)

    const user = await UserModel.findById(_id)
    if (!user) return res.status(400).send("something went wrong!")
    if (user.verified) return res.status(200).send("You're already verified!")

    let emailToken
    const foundToken = await EmailTokenModel.findOne({ userId: _id })
    if (foundToken) emailToken = foundToken
    else // here we create another token incase user's past token expired
      emailToken = await EmailTokenModel.create({
        userId: _id,
        token: crypto.randomBytes(32).toString("hex"),
      })

    await axios.post(
      `${process.env.BASE_URL}/api/verification/sendVerificationEmail`,
      {
        email: user.email,
        emailToken: emailToken.token,
      }
    )
    res.status(200).json("Email sent Successfully ")
  } catch (e) {
    res.status(400).send('from resend: ' + e)
  }
}

export default resend
