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

const Verify = () => {
  const router = useRouter()
  const { emailToken } = router.query
  const [info, setInfo] = useState({})

  useEffect(() => {
    if (emailToken) {
      axios
        .post(`/api/auth/verification/verify`, { emailToken })
        .then((res) => {
          setInfo(
            res.data || {
              message: "Something went wrong please check the url",
              status: "Error",
            }
          )
        })
        .catch((err) => {
          setInfo(
            err.response.data.message || {
              message: "Something went wrong please check the url",
              status: "Error",
            }
          )
        })
    } else {
      setInfo({
        message: "Please Check your email address for the verification link",
        status: "Pending",
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
      if (remaining <= 60) {
        setRemaining(60)
        toast.loading("Sending..", { id: "loading" })

        const response = await axios.get(
          "/api/auth/verification/sendVerificationEmail"
        )
        if (!response)
          return setInfo({
            message: "Something went wrong please retry or check again later",
            status: "Error",
          })

        toast.dismiss("loading")
        toast.success("An email was sent", {
          style: { textAlign: "center" },
        })
        setInfo({
          message: "A new email was sent to you",
          Status: "Pending",
        })
      } else {
        toast.error(`Too many requests! wait for ${remaining} seconds `)
      }
    } catch (e) {
      toast.dismiss("loading")
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
        {info.status !== "Pending" && (
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
