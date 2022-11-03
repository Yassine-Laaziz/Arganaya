import jwt from "jsonwebtoken"

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
}

export default createToken
