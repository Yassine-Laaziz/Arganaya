import styles from "../styles/Checkout.module.css"
import { useStateContext } from "../context/StateContext"
import { BsCartXFill } from "react-icons/bs"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import cookie from "cookie"
import { useEffect } from "react"
import { urlFor } from "../lib/client"

const Checkout = () => {
  const { cartItems } = useStateContext()
  const router = useRouter()
  useEffect(async () => {
    try {
      const jwtToken = cookie.parse(document.cookie).jwtToken
      const req = await axios.post("/api/checkAuthorized", { jwtToken })
      if (!req.data.verified) router.push("/Verify")
    } catch (e) {
      router.push("/Verify")
    }
  }, [])

  return (
    <div className={styles.Checkout}>
      {!cartItems[0] ? (
        <div className={styles.emptyCart}>
          <BsCartXFill className={styles.emptyCartLogo} />
          <p>you currently have nothing on your cart</p>
          <button>
            <Link href="/">Continue shopping?</Link>
          </button>
        </div>
      ) : (
        <>
          <div className={styles.dishesContainer}>
            {cartItems.map((item) => (
              <div className={styles.dishRow}>
                <img
                  src={urlFor(item.images[0])}
                  alt={`Arganaya ${item.name}`}
                />
                <div className={styles.info}>
                  <div className={styles.equations}>
                    <span>
                      {item.quantity} {item.name}
                      {item.quantity > 1 && "s"}
                    </span>
                    <span>
                      {item.quantity} * {item.price} ={" "}
                      {item.quantity * item.price}
                    </span>
                  </div>
                  <p className={styles.description}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <form action="/api/sendOrderEmail" method="post">
            <input
              placeholder="Address Line 1"
              type="text"
              defaultValue={localStorage.getItem("addressLine1") || ''}
              required
            />
            <input
              placeholder="Address Line 2"
              type="text"
              defaultValue={localStorage.getItem("addressLine2") || ''}
              required
            />
            <input
              placeholder="You phone number (in order to contact you)"
              type="tel"
              defaultValue={localStorage.getItem("phoneNumber") || ''}
              required
            />
            <button type="submit">Order</button>
          </form>
        </>
      )}
    </div>
  )
}
export default Checkout
