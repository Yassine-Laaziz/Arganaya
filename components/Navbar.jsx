import styles from "../styles/Navbar.module.css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { AiOutlineShopping } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { useStateContext } from "../context/StateContext"
import { Cart } from "./"

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()

  const router = useRouter()
  const handleLogout = () => {
    localStorage.removeItem("token")
    router.reload()
  }

  const [display, setDisplay] = useState("none")

  const [token, setToken] = useState(false)
  useEffect(() => setToken(localStorage.getItem("token")), [])
  return (
    <div className={styles.container}>
      <p className={styles.logo}>
        <Link href={`/`}>Arganaya</Link>
      </p>
      <div className="middle">
        <CgProfile
          className={styles.profileIcon}
          onClick={() =>
            setDisplay((prev) => (prev === "none" ? "flex" : "none"))
          }
        />
        <div className={styles.profileList} style={{ display }}>
          {token ? (
            <button onClick={() => handleLogout()}>Logout</button>
          ) : (
            <>
              <Link href={"/Signup"}>Sign Up!</Link>
              <Link href={"/Login"}>Login!</Link>
            </>
          )}
        </div>
      </div>
      <button className={styles.cartIcon} onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className={styles.cartItemQty}>{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  )
}
export default Navbar
