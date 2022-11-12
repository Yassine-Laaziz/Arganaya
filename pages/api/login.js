import UserModel from "../../models/Users"
import bcrypt from "bcrypt"
import createToken from "../../lib/createToken"
import { connect } from "../../lib/mongodb"

const handler = async (req, res) => {
  try {
    connect()
    let { email, password } = req.body
    email = email.toLowerCase()
    // validation
    // 1 all fields filled?
    if (!email || !password)
      return res.status(422).send("All fields must be filled!")

    // 2 Correct email?
    const user = await UserModel.findOne({ email, verified: true })
    if (!user) return res.status(404).send("incorrect email or unverified account! (if the account is unverified create a new one!)")

    // 3 Correct password ?
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(422).send("Incorrect password!")

    // refreshing Token
    const {jwtToken, serialized} = createToken(user._id)
    
    res.setHeader("Set-Cookie", serialized)
    res.status(200).send(jwtToken)
  } catch (error) {
    res
      .status(400)
      .send("Something went wrong! please retry or come back later")
  }
}

export default handler
