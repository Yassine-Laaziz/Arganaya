import { verify } from "../../../lib/jwt"
import { serialize } from "cookie"

const profile = async (req, res) => {
  const { objective } = req.body
  if (objective === "check") {
    try {
      const { jwtToken } = req.cookies
      if (!jwtToken) return res.status(400).send('no token')
      const { payload } = await verify(jwtToken)
      let correct,
        verified = false
      if (payload) correct = true
      if (payload?.verified) verified = true
      res.status(200).json({ user: { correct, verified } })
    } catch (e) {
      res.status(400).send("malformed token")
    }
  } else if (objective === "logout") {
    const serialized = serialize("jwtToken", undefined, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    })
    res.setHeader("Set-Cookie", serialized)
    res.send("Logged out successfully")
  }
}

export default profile
