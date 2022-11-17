import styles from "../styles/Components/Navbar.module.css"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { AiOutlineShopping } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { useStateContext } from "../context/StateContext"
import { Cart } from "./"
import cookie from "cookie"

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()
  const [display, setDisplay] = useState(false)

  const [token, setToken] = useState(null)
  useEffect(() => setToken(cookie.parse(document.cookie).jwtToken), [])

  const router = useRouter()
  const handleLogout = () => {
    document.cookie = "jwtToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.reload()
  }

  const handleClick = (e) => {
    !display
      ? setDisplay(true)
      : e.target.classList.contains("modal") && setDisplay(false)
  }

  return (
    <div className={styles.container}>
      <p className={styles.logo}>
        <Link href={`/`}>Arganaya</Link>
      </p>
      <div className="middle">
        <CgProfile
          tabIndex="0"
          className={styles.profileIcon}
          onClick={(e) => handleClick(e)}
        />
        {display && (
          <div className="modal" onClick={(e) => handleClick(e)}>
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
        )}
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
