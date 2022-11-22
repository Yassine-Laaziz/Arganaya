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
  const cleanedCart = []
  cartItems.forEach((item) => {
    const foundDish = dishes.find((dish) => dish._id === item._id)
    if (foundDish) {
      cleanedCart.push({
        ...foundDish,
        qty: item.qty,
        option: item.option,
        params: item.params,
      })
    }
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
              <div
                className={styles.dishRow}
                key={`${item.option}${item.name}${JSON.stringify(
                  item.params
                )}row`}
              >
                <img
                  src={urlFor(item.images[0])}
                  alt={`Arganaya ${item.name}`}
                />
                <div className={styles.info}>
                  <div className={styles.equations}>
                    <span>
                      {item.qty} {item.name}
                    </span>
                    <span>
                      {item.qty} * {item.price}dh = {item.qty * item.price}dh
                    </span>
                  </div>
                  <p className={styles.description}>{item.description}</p>
                  {/* Chosen Option */}
                  <div className={`option ${styles.option}`}>
                    {item.option[0]}
                  </div>
                  {/* Params */}
                  {JSON.stringify(item.params) !== "{}" && (
                    <details className="paramsContainer">
                      <summary className="paramsIcon">
                        <span>...</span>
                      </summary>
                      <div className={`params ${styles.options}`}>
                        {Object.entries(item.params).map((option, i) => (
                          <div
                            className="param"
                            key={`${
                              item.name + JSON.stringify(item.params) + i
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
