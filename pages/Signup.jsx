import styles from "../styles/Athentication.module.css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { useMultistepForm } from "../hooks/useMultistepForm"
import axios from "axios"
import toast from "react-hot-toast"
import Form1 from "../components/SignUp/Form1"
import Form2 from "../components/SignUp/Form2"

const SignUp = () => {
  // initializing states, if user somehow skipped the form, mongodb won't save account
  const [data, setData] = useState({
    name: "",
    lastName: "",
    number: 0,
    email: "",
    addressLine1: "",
    addressLine2: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  // Handle Change
  const handleChange = (property, e) => {
    setData((prev) => {
      prev[property] = e.target.value
      return prev
    })
  }

  // Multistep Form
  const { step, next, back, isFirstStep, isLastStep } = useMultistepForm([
    <Form1 handleChange={handleChange} {...data} key={`Arganaya form 1`} />,
    <Form2 handleChange={handleChange} {...data} key={`Arganaya form 2`} />,
  ])

  // Handle Submit
  const router = useRouter()
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isLastStep) return next()
    setIsLoading(true)
    axios
      .post(`/api/register`, data)
      .then((res) => {
        localStorage.setItem("token", JSON.stringify(res.data))
        toast.success('Email Sent Successfully', {
          style: { textAlign: "center", color: "green" },
          duration: 10000,
        })
        router.push("/Verify")
      })
      .catch((err) => {
        setIsLoading(false)
        const duration = err.response.data.split("").length * 70 + 1500
        toast.error(err.response.data, {
          style: { textAlign: "center", color: "red" },
          duration: duration,
        })
      })
  }

  return (
    <div className={styles.CreateUser}>
      <p className={styles.option}>
        <Link href="/Login">Login?</Link>
      </p>
      <form className={styles.wrapper} onSubmit={handleSubmit}>
        <h1>SIGN UP</h1>

        {step}

        <div className={styles.buttons}>
          {!isFirstStep && (
            <button type="button" onClick={() => back()}>
              Back
            </button>
          )}
          <button type="submit" disabled={isLoading}>
            {isLastStep ? "Confirm" : "Next"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignUp
