import nodemailer from "nodemailer"

const sendVerificationEmail = async (req, res) => {
  const { email, emailToken } = req.body
  try {
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
      to: email,
      subject: "Activate Arganaya Account",
      html: `
        <p>click the following link to verify: <a href="${process.env.BASE_URL}/verify?emailToken=${emailToken}">Verify</a></p>
      `,
    })
    res.status(200).send("email sent succefully")
  } catch (error) {
    console.log('from send: ' + e)
    res.status(400).send("email not sent")
  }
}
export default sendVerificationEmail
