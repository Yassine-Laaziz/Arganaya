import { serialize } from "cookie"
import { SignJWT, jwtVerify } from "jose"
// here i'm using "jose" dependency instead of "jsonwebtoken" because nextjs
// middleware is an edge function that doesn't allow dynamic code evaluation
// like "eval" and unfortunately "jsonwebtoken" uses that, so we're going with "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

export const createToken = async (payload) => {
  const jwtToken = await new SignJWT(payload)
    .setExpirationTime("7d")
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)

  const serialized = serialize("jwtToken", jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return { jwtToken, serialized }
}

export const verify = async (jwt) => await jwtVerify(jwt, secret)
