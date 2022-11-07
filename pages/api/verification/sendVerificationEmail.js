import nodemailer from "nodemailer"
import { connect } from "../../../lib/mongodb"
import UserModel from "../../../models/Users"

const sendVerificationEmail = async (req, res) => {
  try {
    const { emailToken } = req.body
    connect()
    const userInfo = await UserModel.findById(emailToken.token)
    
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
    
    const toggle = () => {
      input = document.querySelector('#password')
      input.type = input.type === "password" ? "text" : "password"
     }

    await transporter.sendMail({
      from: process.env.USER,
      to: userInfo.email,
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
        position: relative;
        left:2%;
        background-color:hsla(0, 0%, 0%, .8);
        ">
          Activate Arganaya Account
        </h1>
        <p style="
        color:red;
        text-align:center;
        font-family: monospace, sans-serif;
        font-size:20px;
        ">
          this was sent to you in order to verify your "Arganaya" Account, if this is you, verify through the button below, if it's not don't do anything, you're totally secure.
        </p>
        <h2 style="
        display:inline-block;
        box-shadow: 0 0 2px 2px white;
        color:white;
        position: relative;
        left:2%;
        background-color:hsla(0, 0%, 0%, .8);">
          Check your info:
        </h2>
        <p style="
        display:inline-block;
        font-family: monospace, sans-serif;
        font-size:20px;">
          full name: ${userInfo.fullName} <br />
          number: ${userInfo.number}<br />
          email: ${userInfo.email}<br />
          address line 1: ${userInfo.addressLine1}<br />
          address line 2: ${userInfo.addressLine2}<br />
        </p>
        <div>
          <input value="${userInfo.password}" readonly type="password" id="password" />
          <span onclick={${toggle()}} style="cursor: pointer, box-shadow: 0 0 5px 5px black">
            <p style="cursor:pointer">show/hide</p>
          </span>
        </div>
        <button style="
        padding: 10px;
        margin-inline:auto
        margin-block:80px 40px;
        font-size:20px;
        font-weight:600;
        background-color:white;
        cursor: pointer;
        transition: ease-in .1s;
        border: 1px solid;
        box-shadow: 0 0 1px 2px;
        border-radius: 10px;
        "><a href="${process.env.BASE_URL}/Verify?emailToken=${emailToken}">Verify?</a></button>
      </main>
      `,
    })
    res.status(200).send("email sent succefully")
  } catch (error) {
    res.status(400).send("we're unable to send email")
  }
}
export default sendVerificationEmail
