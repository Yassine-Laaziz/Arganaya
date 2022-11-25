import { NextResponse } from "next/dist/server/web/spec-extension/response"
import { verify } from "../lib/jwt"

const middleware = async (req) => {
  const { cookies } = req
  const { jwtToken } = cookies
  const { href, origin } = req.nextUrl.clone()

  let user = {}
  try {
    const { payload } = await verify(jwtToken)
    if (payload?.id) user.correct = true
    if (payload?.verified) user.verified = true
  } catch (e) {
    user = { correct: false, verified: false }
  }

  if (href.includes("Checkout")) {
    if (!user.correct) return NextResponse.redirect(`${origin}/Login`)
    if (!user.verified) return NextResponse.redirect(`${origin}/Verify`)
    return NextResponse.next()
  }

  if (href.includes("Login") || href.includes("Singup")) {
    if (user.correct && !user.verified)
      return NextResponse.redirect(`${origin}/Verify`)
    else if (user.verified) return NextResponse.redirect(origin)
    return NextResponse.next()
  }

  if (href.includes("Verify")) {
    if (!user.correct) return NextResponse.redirect(`${origin}/Login`)
    if (user.verified) return NextResponse.redirect(origin)
    return NextResponse.next()
  }
}

export default middleware
