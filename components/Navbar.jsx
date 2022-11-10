import styles from "../styles/Navbar.module.css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect, useRef } from "react"
import { AiOutlineShopping } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { useStateContext } from "../context/StateContext"
import cookie from "cookie"
import { Cart } from "./"

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()

  const [display, setDisplay] = useState("none")
  const modal = useRef()
  useEffect(() => {
    // this is wrapped in useEffect because "window" is not defined at first
    window.addEventListener("click", (e) =>
     e.target === modal.current && setDisplay("none")
    )
  }, [])

  const [token, setToken] = useState(null)
  const router = useRouter()
  useEffect(() => setToken(cookie.parse(document.cookie).jwtToken) , [])
  const handleLogout = () => {
    document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.reload()
  }

  return (
    <div className={styles.container}>
      <p className={styles.logo}>
        <Link href={`/`}>Arganaya</Link>
      </p>
      <div className="middle">
        <CgProfile
          className={styles.profileIcon}
          onClick={() =>
            setDisplay((prev) => (prev === "block" ? "none" : "block"))
          }
        />
        <div className={styles.modal} style={{ display }} ref={modal}>
          <div className={styles.profileList}>
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
