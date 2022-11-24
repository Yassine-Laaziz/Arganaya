import styles from "../styles/Checkout.module.css"
import { useStateContext } from "../context/StateContext"
import { BsCartXFill, BsTruckFlatbed } from "react-icons/bs"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { urlFor, client } from "../lib/client"
import transpileValue from "../lib/utils/transpileValue"
import toast from "react-hot-toast"

const Checkout = ({ dishes, packs }) => {
  const router = useRouter()
  useEffect(() => {
    axios
      .get("/api/checkAuthorized")
      .then((res) => !res.data.verified && router.push("/Verify"))
      .catch(() => router.push("/Verify"))
  }, [])

  const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    //useEffect because localStorage is not defined at first because of next js
    setUserInfo(JSON.stringify(localStorage.getItem("orderingReq") || {}))
  }, [])

  // here is a series of cartItems validation because nextjs doesn't support
  // components having getStaticProps, this validation is just because a person may interrupt
  // localStorage, and i'm trying to use for loops just for better performance
  // i'm sorry if you were a developer looking at this but, this is just temporary
  // because i'm going to update this as soon as the new update drops.
  const { cartItems, clearCart } = useStateContext()
  const cleanedCart = []
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i]

    const foundDish = dishes.find((dish) => dish._id === item._id)
    const foundPack = packs.find((pack) => pack._id === item._id)

    if (foundPack && typeof item.qty === "number") {
      cleanedCart.push({ ...foundPack, qty: item.qty })
    } else if (foundDish && foundDish !== undefined) {
      let correctOption = false
      let correctParams = true
      if (foundDish.options) {
        for (let i = 0; i < foundDish.options.length; i++) {
          const valuePair = foundDish.options[i].split(":")
          const extractedNum = +valuePair[1]?.match(/\d+$/)[0]
          if (item.option === valuePair[0] && item.price === extractedNum) {
            correctOption = true
          }
        }
      } else if (!foundDish.option) correctOption = true
      if (foundDish.params) {
        const entries = Object.entries(item.params)
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          let correctParamName = false
          let correctParamValue = false
          for (let i = 0; i < foundDish.params.length; i++) {
            const trueParam = foundDish.params[i]
            if (entry[0] === trueParam) correctParamName = true
          }
          if (
            entry[1] === "super low" ||
            entry[1] === "low" ||
            entry[1] === "moderate" ||
            entry[1] === "more" ||
            entry[1] === "high"
          ) {
            correctParamValue = true
          }
          if (!correctParamName || !correctParamValue) correctParams = false
        }
      }
      if (correctOption && correctParams) {
        cleanedCart.push({
          ...foundDish,
          qty: item.qty,
          price: item.price,
          option: item.option,
          params: item.params,
        })
      }
    }
  }
  const totalPrice = cleanedCart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  )

  const handleChange = (e, field) =>
    setUserInfo((prev) => ({ ...prev, [field]: e.target.value }))

  const [showErrMsg, setShowErrMsg] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    toast.loading("ordering...", { id: "ordering" })
    setLoading(true)
    axios
      .post("/api/sendOrder", { userInfo, cleanedCart })
      .then(() => {
        clearCart()
        localStorage.setItem("orderingReq", JSON.stringify(userInfo))
        // redirect
      })
      .catch(() => setShowErrMsg(true))
      .finally(() => {
        setLoading(false)
        toast.dismiss("ordering")
      })
  }

  const fixProblem = () => {
    setLoading(true)
    toast.loading("fixing...", { id: "fixing" })
    localStorage.clear()
    clearCart()
    router.push("/").finally(() => {
      toast.dismiss("fixing")
      toast.success("check now", { duration: "10" })
    })
  }

  return (
    <div className={styles.Checkout}>
      {!cleanedCart[0] ? (
        <section className={styles.emptyCart}>
          <BsCartXFill className={styles.emptyCartLogo} />
          <p>you currently have nothing on your cart</p>
          <button>
            <Link href="/" onClick={() => localStorage.removeItem("cart")}>
              Continue shopping?
            </Link>
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
                      {item.qty} * {item.price}dh ={" "}
                      <span className="price">{item.qty * item.price}dh</span>
                    </span>
                  </div>
                  <p className={styles.description}>{item.description}</p>
                  {/* Chosen Option */}
                  {item.option && (
                    <div className={`option ${styles.option}`}>
                      {item.option}
                    </div>
                  )}
                  {/* Params */}
                  {item.params && JSON.stringify(item.params) !== "{}" && (
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
          <h2>total of {totalPrice}dh</h2>

          <form onSubmit={(e) => handleSubmit(e)}>
            <input
              placeholder="Address Line 1"
              type="text"
              defaultValue={
                JSON.parse(localStorage.getItem("orderingReq"))?.addressLine1 ||
                ""
              }
              onChange={(e) => handleChange(e, "addressLine1")}
              required
            />
            <input
              placeholder="Address Line 2"
              type="text"
              defaultValue={
                JSON.parse(localStorage.getItem("orderingReq"))?.addressLine2 ||
                ""
              }
              onChange={(e) => handleChange(e, "addressLine2")}
              required
            />
            <input
              placeholder="You phone number (in order to contact you)"
              type="number"
              defaultValue={
                JSON.parse(localStorage.getItem("orderingReq"))?.phoneNumber ||
                ""
              }
              onChange={(e) => handleChange(e, "phoneNumber")}
              required
            />
            <button type="submit" disabled={loading}>
              Order
            </button>
            {showErrMsg && (
              <>
                <div className={styles.errorMsg}>
                  something went wrong! there are several checks we can try to
                  address the problem, if you want to proceed just click the
                  button below
                </div>
                <button onClick={() => fixProblem()}>Proceed</button>
              </>
            )}
          </form>
        </>
      )}
    </div>
  )
}

export const getServerSideProps = async () => {
  const dishesQuery = '*[_type == "dish"]'
  const dishes = await client.fetch(dishesQuery)

  const packsQuery = '*[_type == "pack"]'
  const packs = await client.fetch(packsQuery)

  return {
    props: { dishes, packs },
  }
}

export default Checkout
