import styles from "../styles/Success.module.css"
import { useEffect } from "react"
import fireWorks from "../lib/utils/confetti"
import Link from "next/link"

const Success = () => {
  useEffect(() => {
    fireWorks()
  }, [])
  return (
    <div className={styles.container}>
      <p>
        Your Order Was Successful!
        <br />
        Please contact us if you have any questions at
        <br />
        "ArganayaYummy@gmail.com"
      </p>

      <Link href="/">Continue</Link>
    </div>
  )
}

export default Success
