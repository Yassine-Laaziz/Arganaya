import { NextResponse } from "next/dist/server/web/spec-extension/response"
import { verify } from "../lib/jwt"

const middleware = async (req) => {
  const { cookies } = req
  const { jwtToken } = cookies
  const { href, origin } = req.nextUrl.clone()

  let runned = false
  let signedUp, verified
  const getPayload = async () => {
    if (!runned) {
      try {
        const { payload } = await verify(jwtToken)
        signedUp = payload.signedUp
        verified = payload.verified
      } catch (e) {
        signedUp = false
        verified = false
      }
    }
  }

  if (href.includes("Checkout")) {
    await getPayload()
    if (!signedUp) return NextResponse.redirect(`${origin}/Login`)
    else if (!verified) return NextResponse.redirect(`${origin}/Verify`)
    return NextResponse.next()
  }

  if (href.includes("Login") || href.includes("Signup")) {
    await getPayload()
    if (signedUp && !verified) return NextResponse.redirect(`${origin}/Verify`)
    else if (verified) return NextResponse.redirect(origin)
    return NextResponse.next()
  }

  if (href.includes("Verify")) {
    await getPayload()
    if (!signedUp) return NextResponse.redirect(`${origin}/Login`)
    if (verified) return NextResponse.redirect(origin)
    return NextResponse.next()
  }
}

export default middleware
