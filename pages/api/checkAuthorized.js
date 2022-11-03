import { connect } from "../../lib/mongodb"
import UserModel from "../../models/Users"
import jwt from "jsonwebtoken"

const checkVerified = async (req, res) => {
  try {
    connect()
    const jwtToken = await JSON.parse(req.body.jwtToken)
    const { _id } = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
    const user = await UserModel.findById(_id)
    if (!user) return res.status(401).json({ user: null, verified: null })
    if (!user.verified)
      return res.status(200).json({ user: true, verified: null })

    res.status(200).json({ user: true, verified: true })
  } catch (error) {
    res.status(401).json({ user: null, verified: null })
  }
}

export default checkVerified
