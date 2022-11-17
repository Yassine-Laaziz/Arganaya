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
          <div className="empty-cart">
            <AiOutlineShopping size={150} />
            <h3>You Shopping Bag is Empty</h3>
            <Link href="/">
              <button type="button" className="btn" onClick={() => closeCart()}>
                Continue Shopping
              </button>
            </Link>
          </div>
        )}

        <div className="dish-container">
          {cartItems.length >= 1 &&
            cartItems.map((item, i) => (
              <div
                className="dish"
                key={`cart${item._id}${JSON.stringify(item.chosenOptions) + i}`}
              >
                <img
                  src={urlFor(item.images[0])}
                  className="cart-dish-image"
                  alt="Arganaya"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <p>
                      <span className="price">{item.price}dh</span>
                      {item.perPiece && (
                        <span className="per-piece">/per piece </span>
                      )}
                    </p>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(
                              item._id,
                              item.chosenOptions,
                              "dec"
                            )
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(
                              item._id,
                              item.chosenOptions,
                              "inc"
                            )
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="btn"
                      className="remove-item"
                      onClick={() => onRemove(item._id, item.chosenOptions)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                  {/* Options */}
                  {JSON.stringify(item.chosenOptions) !== "{}" && (
                    <details className="optionsContainer">
                      <summary className="optionsLogo">
                        <span>...</span>
                      </summary>
                      <div className="options">
                        {Object.entries(item.chosenOptions).map((option, i) => (
                          <div
                            className="option"
                            key={`${
                              item.name + JSON.stringify(item.chosenOptions) + i
                            }cartOption`}
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
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <p className="total">
              <h3>Subtotal:</h3>
              <h3>{totalPrice}dh</h3>
            </p>
            <div className="btn-container">
              <Link href="/Checkout">
                <button
                  type="button"
                  className="btn"
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
