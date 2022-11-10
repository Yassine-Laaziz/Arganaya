import { serialize } from "cookie"
import jwt from "jsonwebtoken"

const createToken = (_id) => {
  const jwtToken = jwt.sign({ _id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })
  const serialized = serialize("jwtToken", jwtToken , {
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return {jwtToken, serialized}
}

export default createToken
