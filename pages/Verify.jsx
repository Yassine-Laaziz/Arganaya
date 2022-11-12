import styles from "../styles/Verify.module.css"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import {
  MdOutlineEmail,
  MdOutlineMarkEmailRead,
  MdOutlineSmsFailed,
} from "react-icons/md"
import cookie from "cookie"

const Verify = () => {
  const router = useRouter()
  const { emailToken } = router.query
  const [info, setInfo] = useState({})

  useEffect(() => {
    axios
      .get("/api/checkAuthorized")
      .then((res) => {
        if (!res.data.user) router.push("Login")
        if (res.data.verified)
          setInfo({ message: "You're already verified!", status: "Success" })
      })
      .catch((res) => !res.user && router.push("/Login"))
  }, [])

  useEffect(() => {
    if (emailToken) {
      axios
        .post(`/api/verification/verify`, { emailToken })
        .then((res) => setInfo(res.data))
        .catch((err) => {
          setInfo(
            err.response.data || {
              message: "Something went wrong please check the url",
              status: "Error",
            }
          )
        })
    } else {
      setInfo({
        message: "Please Check your email address for the verification link",
        status: "Pending..",
      })
    }
  }, [emailToken]) // the query property doesn't load on first render

  // creating a countdown until the user is allowed to get another email.
  const [remaining, setRemaining] = useState(40)
  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const resend = async () => {
    try {
      if (remaining <= 0) {
        setRemaining(60)
        toast.loading("Sending..", { id: "loading" })
        const response = await axios.post(
          "/api/verification/resendVerificationEmail",
          { jwtToken: cookie.parse(document.cookie).jwtToken }
        )
        if (!response)
          return setInfo({
            message: "Something went wrong please retry or check again later",
            status: "Error",
          })

        setInfo(
          response.data.info || {
            message: "Something went wrong please retry or check again later",
            Status: "Error",
          }
        )
        toast.dismiss("loading")
        toast.success(
          response.data.info.message ||
            "Something went wrong, retry or contact us",
          {
            style: { textAlign: "center" },
          }
        )
      } else {
        toast.error(`Too many requests! wait for ${remaining} seconds `)
      }
    } catch (e) {
      setInfo({
        message: "Something went wrong please retry or check again later",
        Status: "Error",
      })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        {/* handling each status differently */}
        {info.status === "Error" ? (
          <>
            <p className={styles.head}>Something went wrong!</p>
            <MdOutlineSmsFailed className={styles.icon} fill="red" />
          </>
        ) : info.status === "Success" ? (
          <>
            <p className={styles.head}>You may close this window now</p>
            <MdOutlineMarkEmailRead className={styles.icon} fill="green" />
          </>
        ) : (
          <>
            <p className={styles.head}>
              Please Check your Email account for the link.
            </p>
            <MdOutlineEmail className={styles.icon} fill="gray" />
          </>
        )}
        <p className={styles.status}>{info.status}</p>
        {/* if it's not pending */}
        {info.status !== "Pending.." && (
          <p className={styles.message}>{info.message}</p>
        )}
        {/* if is not success*/}
        {info.status !== "Success" && (
          <button onClick={() => resend()}>Resend</button>
        )}
      </div>
    </div>
  )
}
export default Verify
