import styles from "../styles/Checkout.module.css"
import { useStateContext } from "../context/StateContext"
import { BsCartXFill } from "react-icons/bs"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { urlFor, client } from "../lib/client"
import transpileValue from "../lib/utils/transpileValue"

const Checkout = ({ dishes }) => {
  const router = useRouter()
  useEffect(() => {
    axios
      .get("/api/checkAuthorized")
      .then((res) => !res.data.verified && router.push("/Verify"))
      .catch(() => router.push("/Verify"))
  }, [])

  const { cartItems } = useStateContext()
  const cleanedCart = cartItems.filter((item) => {
    let status = false
    dishes.forEach((dish) => {
      if (dish._id === item._id && dish.price === item.price) status = true
    })
    return status
  })

  return (
    <div className={styles.Checkout}>
      {!cleanedCart[0] ? (
        <section className={styles.emptyCart}>
          <BsCartXFill className={styles.emptyCartLogo} />
          <p>you currently have nothing on your cart</p>
          <button>
            <Link href="/">Continue shopping?</Link>
          </button>
        </section>
      ) : (
        <>
          <section className={styles.dishesContainer}>
            {cleanedCart.map((item) => (
              <div className={styles.dishRow} key={`Checkout${item.name}row`}>
                <img
                  key={`Checkout${item.name}image`}
                  src={urlFor(item.images[0])}
                  alt={`Arganaya ${item.name}`}
                />
                <div className={styles.info} key={`Checkout${item.name}info`}>
                  <div
                    className={styles.equations}
                    key={`Checkout${item.name}equations`}
                  >
                    <span key={`Checkout${item.name}equations1`}>
                      {/* 2 hummus tahini => 2 hummus tahini's' */}
                      {item.quantity} {item.name}
                      {item.quantity > 1 && "s"}
                    </span>
                    <span key={`Checkout${item.name}equations2`}>
                      {item.quantity} * {item.price}dh ={" "}
                      {item.quantity * item.price}dh
                    </span>
                  </div>
                  <p
                    className={styles.description}
                    key={`Checkout${item.name}description`}
                  >
                    {item.description}
                  </p>
                  {/* Options */}
                  {JSON.stringify(item.chosenOptions) !== "{}" && (
                    <details className="optionsContainer">
                      <summary className="optionsLogo">
                        <span>...</span>
                      </summary>
                      <div className={`options ${styles.options}`}>
                        {Object.entries(item.chosenOptions).map((option, i) => (
                          <div
                            className={`option`}
                            key={`${
                              item.name + JSON.stringify(item.chosenOptions) + i
                            }CheckoutOption`}
                            style={{
                              border: `5px solid ${transpileValue(
                                option[1],
                                "toColor"
                              )}`,
                            }}
                          >
                            <p
                              style={{
                                backgroundColor: transpileValue(
                                  option[1],
                                  "toColor"
                                ),
                              }}
                              className="optionHead"
                            >
                              {option[1]}
                            </p>
                            <p className={styles.optionBottom}>{option[0]}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </section>
          <form action="/api/sendOrderEmail" method="post">
            <input
              placeholder="Address Line 1"
              type="text"
              defaultValue={localStorage.getItem("addressLine1") || ""}
              required
            />
            <input
              placeholder="Address Line 2"
              type="text"
              defaultValue={localStorage.getItem("addressLine2") || ""}
              required
            />
            <input
              placeholder="You phone number (in order to contact you)"
              type="tel"
              defaultValue={localStorage.getItem("phoneNumber") || ""}
              required
            />
            <button type="submit">Order</button>
          </form>
        </>
      )}
    </div>
  )
}

export const getServerSideProps = async () => {
  const dishesQuery = '*[_type == "dish"]'
  const dishes = await client.fetch(dishesQuery)
  return {
    props: { dishes },
  }
}

export default Checkout
