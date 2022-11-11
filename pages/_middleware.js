import { verify } from "jsonwebtoken"
import { NextResponse } from "next/dist/server/web/spec-extension/response"

const middleware = (req) => {
  const url = req.nextUrl.clone()
  const { cookies } = req
  const { jwtToken } = cookies
  let verifiedToken = verify(jwtToken, process.env.JWT_SECRET_KEY) || null
  

  if (url.href.includes(`Login`) || url.href.includes(`Signup`)) {
    if (verifiedToken) return NextResponse.redirect(`${url.origin}/`)
  }

  if (url.href.includes(`Checkout`)) {
    if (!verifiedToken) return NextResponse.redirect(`${url.origin}/Login`)
  }
  
  NextResponse.next()
}

export default middleware
