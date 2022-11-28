import nodemailer from "nodemailer"
import { connect } from "../../lib/mongodb"
import { parse } from "cookie"
import { verify } from "../../lib/jwt"

const sendOrder = async (req, res) => {
  try {
    connect()
    const { jwtToken } = parse(req.headers.cookie)
    const { payload } = await verify(jwtToken, process.env.JWT_SECRET_KEY)
    const { verified, user } = payload
    if (!verified) return res.status(400).end()
    const { name, email } = user

    const { cleanedCart, userInfo } = req.body
    const totalPrice = cleanedCart.reduce(
      (total, item) => total + item.price * item.qty,
      0
    )

    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.USER,
      to: process.env.USER,
      subject: "order",
      html: `
        <h2>User info</h2>
        <p>name: ${name}</p>
        <p>Phone number: ${userInfo.phoneNumber}</p>
        <p>email: ${email}</p>
        <p>address line 1: ${userInfo.addressLine1}</p>
        <p>address line 2: ${userInfo.addressLine2}</p>
        
        <h2>Orders</h2>
        ${cleanedCart?.map(
          (item) => `
        <h3>--${item.qty} ${item.name}--</h3>
        ${item.option ? `<p>option: ${item.option}</p>` : ""}
        ${
          !item.params
            ? ""
            : JSON.stringify(item.params) === "{}"
            ? ""
            : Object.entries(item.params)?.map(
                (param) => `<p>${param[0]}: ${param[1]}</p>`
              )
        }
        `
        )}

        <h2> A total of ${totalPrice}dh </h2>
      `,
    })

    res.status(200).send("email sent successfully!")
  } catch (error) {
    res.status(400).send("we're unable to send email")
  }
}
export default sendOrder
