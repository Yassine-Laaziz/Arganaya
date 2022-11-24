import styles from "../styles/Athentication.module.css"
import { useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"

const Login = () => {
  // initializing states, if user somehow skipped the form, mongodb won't save account
  const [data, setData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Handle Change
  const handleChange = (property, e) => {
    setData((prev) => {
      prev[property] = e.target.value
      return prev
    })
  }

  // handle Submit
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    axios
      .post(`/api/auth/login`, data)
      .then(() => {
        setIsLoading(false)
        toast.success("Successfully Logged in!")
        router.reload()
        router.push("/")
      })
      .catch((err) => {
        setIsLoading(false)
        const duration = err.response.data.split("").length * 70 + 1500
        toast.error(err.response.data, {
          style: { color: "red" },
          duration: duration,
        })
      })
  }

  return (
    <div className={styles.CreateUser}>
      <p className={styles.option}>
        <Link href="/Signup">Sign Up?</Link>
      </p>
      <form className={styles.wrapper} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          placeholder="email"
          onChange={(e) => handleChange("email", e, setData)}
          type="email"
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
          required
        />
        <input
          placeholder="password"
          onChange={(e) => handleChange("password", e, setData)}
          type="password"
          required
        />
        <button type="submit" disabled={isLoading} className={styles.loginBtn}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
