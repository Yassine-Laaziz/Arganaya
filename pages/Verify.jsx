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
  const { emailToken, email } = router.query
  const [info, setInfo] = useState({})

  useEffect(() => {
    const jwtToken = localStorage.getItem("token")
    axios
      .post("/api/checkAuthorized", { jwtToken })
      .then((res) => !res.data.user && router.push("Login"))
      .catch((res) => !res.user && router.push("/Login"))
  }, [])

  useEffect(() => {
    if (emailToken && email) {
      axios
        .get(`/api/verification/verify?emailToken=${emailToken}`)
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
  }, [emailToken, email]) // the query property doesn't load on first render

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
        const response = await axios.post(
          "/api/verification/resendVerificationEmail",
          { jwtToken: localStorage.getItem("token") }
        )

        if (!response)
          return toast.error(
            "something went wrong we're unable to email you the link"
          )

        toast.success(response.data, {
          style: { textAlign: "center", color: "green" },
        })
      } else {
        toast.error(`Too many requests! wait for ${remaining} seconds `)
      }
    } catch (e) {
      toast.error("something went wrong we're unable to email you the link", {
        style: { textAlign: "center" },
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
        {/* if it's not pending */}
        <p className={styles.status}>{info.status}</p>
        {info.status !== "Pending.." && (
          <p className={styles.message}>{info.message}</p>
        )}
        {/* if status === error */}
        {info.status === "Error" && (
          <button onClick={() => resend()}>resend</button>
        )}
        {/* if is pending*/}
        {info.status === "Pending.." && (
          <button onClick={() => resend()}>resend</button>
        )}
      </div>
    </div>
  )
}
export default Verify
