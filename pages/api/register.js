import { connect } from "../../lib/mongodb"
import UserModel from "../../models/Users"
import EmailTokenModel from "../../models/Token"
import bcrypt from "bcrypt"
import validator from "validator"
import createToken from "../../lib/createToken"
import crypto from "crypto"
import axios from "axios"

const handler = async (req, res) => {
  try {
    connect()
    //for more security
    const user = {
      fullName: req.body.fullName,
      number: req.body.number,
      email: req.body.email,
      addressLine1: req.body.addressLine1,
      addressLine2: req.body.addressLine2,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    }
    // validation
    // 1 all fields required ?
    if (
      !user.fullName ||
      !user.number ||
      !user.email ||
      !user.addressLine1 ||
      !user.addressLine2 ||
      !user.password ||
      !user.confirmPassword
    )
      return res.status(422).send("All fields must be filled")

    // 2 is true email ?
    const email = user.email.toLowerCase()
    // email to lower case, incase a user forgets the lower and upper cases
    user.email = email
    if (!validator.isEmail(email))
      return res.status(422).send("email is not valid!")

    // 3 is already Created ?
    // here we check if there is a verified user with the same email account
    const exists = await UserModel.findOne({ email })
    if (exists && exists.verified)
      return res.status(422).send("Account Already Registered!")
    else if (exists && !exists.verified)
      await UserModel.findByIdAndDelete(exists._id)

    // password & confirm password the same?
    if (user.password !== user.confirmPassword) {
      return res
        .status(422)
        .send("Password and confirm password aren't the same!")
    }

    // 5 is Strong password ?
    if (!validator.isStrongPassword(user.password)) {
      return res
        .status(422)
        .send(
          "Password Must be more than 8 letters and Contain At least: one special Character, one Uppercase letter, one Lowercase letter and one number!"
        )
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    // Creating User
    const User = await UserModel.create(user)

    // jwt Token
    const { jwtToken, serialized } = createToken(User._id)

    res.setHeader("Set-Cookie", serialized)
    res.status(200).send(jwtToken)

    // function continues to send email after response..
    const emailToken = await EmailTokenModel.create({
      userId: User._id,
      token: crypto.randomBytes(32).toString("hex"),
    })

    axios.post(
      `${process.env.BASE_URL}/api/verification/sendVerificationEmail`,
      { emailToken }
    )
  } catch (error) {
    res.status(400).send("Something went wrong! Please Retry or Check later")
  }
}
export default handler
