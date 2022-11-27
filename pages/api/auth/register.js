import { connect } from "../../../lib/mongodb"
import UserModel from "../../../models/Users"
import bcrypt from "bcrypt"
import validator from "validator"
import { createToken } from "../../../lib/jwt"
import crypto from "crypto"
import axios from "axios"

const handler = async (req, res) => {
  try {
    connect()
    //for more security
    const { name, email, password, confirmPassword } = req.body
    const user = { name, email, password }
    // validation
    // 1 all fields required
    if (!name || !email || !password || !confirmPassword)
      return res.status(422).send("All fields must be filled")

    // 2 is true email ?
    // email to lower case, incase a user forgets the lower and upper characters
    const lowerEmail = user.email.toLowerCase()
    user.email = lowerEmail
    if (!validator.isEmail(email))
      return res.status(422).send("email is not valid!")

    // 3 is already Created ?
    // here we check if there is a verified user with the same email account
    const exists = await UserModel.findOne({ email })
    if (exists && exists.verified)
      return res.status(422).send("Account Already Registered!")

    // 4 password & confirm password the same ?
    if (password !== confirmPassword) {
      return res
        .status(422)
        .send("Password and confirm password aren't the same!")
    }

    // 5 is Strong password ?
    if (!validator.isStrongPassword(password)) {
      return res
        .status(422)
        .send(
          "Password Must be more than 8 letters and Contain At least: one special Character, one Uppercase letter, one Lowercase letter and one number!"
        )
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // we create user when he verifies himself first at ./verification/verify
    // now we just save it inside of the jwtToken
    // jwt Token
    const emailToken = crypto.randomBytes(124).toString("hex")
    const { jwtToken, serialized } = await createToken({
      signedUp: true,
      emailToken,
      user
    })

    res.setHeader("Set-Cookie", serialized)
    res.status(200).send(jwtToken)

    // function continues to send email after response..

    axios.get(
      `${process.env.BASE_URL}/api/auth/verification/sendVerificationEmail`
    )
  } catch (error) {
    res.status(400).send("Something went wrong! Please Retry or Check later")
  }
}
export default handler
