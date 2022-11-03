import jwt from "jsonwebtoken"
import EmailTokenModel from "../../../models/Token"
import UserModel from "../../../models/Users"
import axios from "axios"

const resend = async (req, res) => {
  try {
    const jwtToken = await JSON.parse(req.body.jwtToken)
    if (!jwtToken) return res.status(400).send("something went wrong!")
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)

    const user = await UserModel.findById(_id)
    if (!user) return res.status(400).send("something went wrong!")
    if (user.verified) return res.status(200).send("You're already verified!")

    const emailToken = await EmailTokenModel.findOne({ userId: _id })
    if (!emailToken) return res.status(400).send("You're already verified!")

    const sent = await axios.post("http://localhost:3000/api/verification/sendVerificationEmail", {
      email: user.email,
      emailToken: emailToken.token
    })
    if (!sent) res.status(200).json("Email sent Successfully ")
  } catch (e) {
    res.status(400).send("something went wrong!")
  }
}

export default resend
