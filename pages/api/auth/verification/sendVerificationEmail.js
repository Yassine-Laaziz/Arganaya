import nodemailer from "nodemailer"
import isEmail from "validator/lib/isEmail"
import { verify } from "../../../../lib/jwt"

const sendVerificationEmail = async (req, res) => {
  try {
    const { payload } = await verify(req.cookies.jwtToken)
    const { user, emailToken } = payload
    if (!user?.email) return res.status(400).end()
    if (!isEmail(user.email)) return res.status(400).end()
    const { name, email } = user

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
      to: user.email,
      subject: "Activate Arganaya Account",
      html: `
      <main style="
      width:70vw;
      heitght:70vh;
      margin-inline:auto;
      background-color:hsla(0, 0%, 0%, .1);
      border-inline: 1px solid black;
      ">
        <h1 style="
        display:inline-block;
        box-shadow: 0 0 2px 2px white;
        color:white;
        background-color:hsla(0, 0%, 0%, .8);
        ">
          Activate Arganaya Account
        </h1>
        <p style="
        color: hsl(0, 0%, 40%);
        font-family: monospace, sans-serif;
        font-size:20px;
        ">
          Somebody tried to Sign up with the following data, if it's you verify yourself by pressing the button below, if it's not just ignore this message
        </p>
        <p style="
        margin-top:20px;
        font-family: monospace, sans-serif;
        font-size:20px;
        color:black;">
          name: ${name} <br />
          email: ${email}<br />
        </p>
        <a style="
        display: block;
        padding: 10px;
        margin-top:80px;
        text-align:center;
        font-size:20px;
        font-weight:600;
        background-color:white;
        cursor: pointer;
        transition: ease-in .1s;
        border: 1px solid;
        box-shadow: 0 0 1px 2px;
        border-radius: 10px;
        text-decoration:none;
        color:inherit;"
        href="${process.env.BASE_URL}/Verify?emailToken=${emailToken}">
          Verify
        </a>
      </main>
      `,
    })

    res.status(200).send("email sent successfully!")
  } catch (error) {
    res.status(400).send("we're unable to send email")
  }
}
export default sendVerificationEmail
