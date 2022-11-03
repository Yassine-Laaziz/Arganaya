import { connect } from "../../lib/mongodb"
import UserModel from "../../models/Users"
import bcrypt from "bcrypt"
import validator from "validator"
import createToken from "../../lib/createToken"
import EmailTokenModel from "../../models/Token"
import crypto from "crypto"
import axios from "axios"

const handler = async (req, res) => {
  try {
    connect()
    //for more security
    const user = {
      name: req.body.name,
      lastName: req.body.lastName,
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
      !user.name ||
      !user.lastName ||
      !user.number ||
      !user.email ||
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
    const exists = await UserModel.findOne({ email })
    if (exists) return res.status(422).send("Account Already Registered!")

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
    const jwtToken = createToken(User._id)

    res.status(200).send(jwtToken)

    // function continues to send email after response..
    // Email activation
    const emailToken = await EmailTokenModel.create({
      userId: User._id,
      token: crypto.randomBytes(32).toString("hex"),
    })

    await axios.post(`${process.env.BASE_URL}/api/verification/sendVerificationEmail`, {
      email: User.email,
      emailToken: emailToken.token
    })
  } catch (error) {
    res.status(400).send("Something went wrong! Please Retry or Check later")
  }
}
export default handler
