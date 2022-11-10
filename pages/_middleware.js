import { verify } from "jsonwebtoken"
import { NextResponse } from "next/dist/server/web/spec-extension/response"

const middleware = async (req) => {
  const url = req.nextUrl.clone()
  const { cookies } = req
  const { jwtToken } = cookies
  let verifiedToken
  if (jwtToken)
    try {
      verifiedToken = verify(jwtToken, process.env.JWT_SECRET_KEY)
    } catch (e) {
      verifiedToken = null
    }

  if (url.href.includes(`Login`) || url.href.includes(`Signup`)) {
    if (verifiedToken) return NextResponse.redirect(`${url.origin}/`)
  }

  if (url.href.includes(`Checkout`)) {
    if (!verifiedToken) return NextResponse.redirect(`${url.origin}/Login`)

    NextResponse.next()
  }
}

export default middleware
