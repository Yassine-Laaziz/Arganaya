import styles from "../styles/Components/Cart.module.css"
import Link from "next/link"
import { useState } from "react"
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai"
import { TiDeleteOutline } from "react-icons/ti"
import { useStateContext } from "../context/StateContext"
import { urlFor } from "../lib/client"
import transpileValue from "../lib/utils/transpileValue"

const Cart = () => {
  const {
    totalPrice,
    totalQuantities,
    cartItems,
    setShowCart,
    toggleCartItemQuantity,
    onRemove,
  } = useStateContext()

  // ==Animate-Cart-On-Start==
  const [animation, setAnimation] = useState(`${styles.toLeft} .3s ease-out`)
  // The User can only close the cart from the cart itself
  // so i'm defining a close cart function here
  const closeCart = () => {
    setAnimation(`${styles.toRight} .3s ease-out`)
    setTimeout(() => {
      setShowCart(false)
    }, 300)
  }

  const handleClick = (e) => {
    if (e.target.classList.contains("modal")) closeCart()
  }

  return (
    <div className="modal" onClick={(e) => handleClick(e)}>
      <div className={styles.cartContainer} style={{ animation }}>
        <button
          type="button"
          className={styles.cartHeading}
          onClick={() => closeCart()}
        >
          <AiOutlineLeft />
          <span className={styles.heading}>Your Cart</span>
          <span className={styles.cartNumItems}>({totalQuantities} items)</span>
        </button>

        {cartItems.length < 1 && (
          <div className={styles.emptyCart}>
            <AiOutlineShopping size={150} />
            <h3>Your Shopping Bag is Empty</h3>
            <Link href="/">
              <button
                type="button"
                className={styles.btn}
                onClick={() => closeCart()}
              >
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className={styles.dishContainer}>
          {cartItems.length >= 1 &&
            cartItems.map((item, i) => (
              <div
                className={styles.dish}
                key={`cart${item._id}${JSON.stringify(item.params) + i}`}
              >
                <img
                  src={urlFor(item.images[0])}
                  className={styles.cartDishImage}
                  alt="Arganaya"
                />
                <div className={styles.itemDesc}>
                  <div className={`${styles.flex} top`}>
                    <h5>{item.name}</h5>
                    <p>
                      <span className="price">{item.price}dh</span>
                      {item.perPiece && (
                        <span className="per-piece">/for each piece </span>
                      )}
                    </p>
                  </div>
                  {/* Chosen Option */}
                  {item.option && <span className="option">{item.option}</span>}

                  <div className={styles.flex}>
                    <p className={`quantity-desc ${styles.quantityDesc}`}>
                      <span
                        className="minus"
                        tabIndex="0"
                        onClick={() =>
                          toggleCartItemQuantity({
                            dish: item,
                            value: -1,
                          })
                        }
                      >
                        <AiOutlineMinus />
                      </span>
                      <span className="num">{item.qty}</span>
                      <span
                        className="plus"
                        tabIndex="0"
                        onClick={() =>
                          toggleCartItemQuantity({
                            dish: item,
                            value: 1,
                          })
                        }
                      >
                        <AiOutlinePlus />
                      </span>
                    </p>
                    <button
                      type="btn"
                      className={styles.removeItem}
                      onClick={() =>
                        onRemove({
                          dish: item,
                        })
                      }
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                  {/* Parameters */}
                  {item.params && JSON.stringify(item.params) !== "{}" && (
                    <details>
                      <summary className="paramsIcon">
                        <span>...</span>
                      </summary>
                      {Object.entries(item.params).map((param, i) => (
                        <p
                          key={`${
                            item.name + JSON.stringify(item.params) + i
                          }cartParams`}
                        >
                          <span
                            style={{
                              color: transpileValue(
                                param[1],
                                "toColor"
                              ),
                            }}
                            className="paramHead"
                          >
                            {param[1]}
                          </span>
                          <span> {param[0]}</span>
                        </p>
                      ))}
                    </details>
                  )}
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className={styles.cartBottom}>
            <div className={styles.total}>
              <h3>Subtotal:</h3>
              <h3>{totalPrice}dh</h3>
            </div>
            <div className={styles.btnContainer}>
              <Link href="/Checkout">
                <button
                  type="button"
                  className={styles.btn}
                  onClick={() => closeCart()}
                >
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Cart
