import { useRef, useEffect } from "react"
import Link from "next/link"
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineLeft,
  AiOutlineShopping,
} from "react-icons/ai"
import { TiDeleteOutline } from "react-icons/ti"
import { useStateContext } from "../context/StateContext"
import { urlFor } from "../lib/client"

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
  const cartRef = useRef()
  useEffect(() => (cartRef.current.style.animation = "toLeft .3s ease-out"), [])
  // The User can only close the cart from the cart itself
  // so i'm defining a close cart function here
  const closeCart = () => {
    cartRef.current.style.animation = "toRight .3s ease-out"

    setTimeout(() => {
      setShowCart(false)
    }, 300)
  }

  // this is wrapped in useEffect because "window" is not defined at first
  const modal = useRef()
  useEffect(() => {
    window.addEventListener("click", (e) => e.target === modal.current && closeCart())
  }, [])

  return (
    <div className="cart-wrapper" ref={modal} >
      <div className="cart-container" ref={cartRef}>
        <button
          type="button"
          className="cart-heading"
          onClick={() => closeCart()}
        >
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
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
            cartItems.map((item) => (
              <div className="dish" key={item._id}>
                <img
                  src={urlFor(item.images[0])}
                  className="cart-dish-image"
                  alt="Arganaya"
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>${item.price}</h4>
                  </div>
                  <div className="flex bottom">
                    <div>
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "dec")
                          }
                        >
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity(item._id, "inc")
                          }
                        >
                          <AiOutlinePlus />
                        </span>
                      </p>
                    </div>
                    <button
                      type="btn"
                      className="remove-item"
                      onClick={() => onRemove(item._id)}
                    >
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems.length >= 1 && (
          <div className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>${totalPrice}</h3>
            </div>
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
