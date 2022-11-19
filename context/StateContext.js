import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-hot-toast"

const Context = createContext()

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)

  // this is for persisting data
  useEffect(() => {
    // these will after be filtered incase user modifies localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || null
    const totalQty = cart?.reduce((total, cartItem) => {
      return total + cartItem.qty
    }, 0)
    const totalPrice = cart?.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.qty
    }, 0)
    setCartItems(cart || [])
    setTotalQuantities(totalQty || 0)
    setTotalPrice(totalPrice || 0)
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  let foundDish

  const onAdd = ({ dish, paramsState, optionState }) => {
    // here we redefine variables to avoid using a state
    const params = paramsState
    const option = optionState
    // here we remove 'moderate' because it may interrupt the comparing part
    const keys = Object.keys(paramsState)
    for (let i = 0; i < keys.length; i++) {
      const param = keys[i]
      if (params[param] === "moderate") delete params[param]
    }

    setTotalPrice((prevTotalPrice) => prevTotalPrice + dish.price * qty)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + qty)

    let dishInCart = false
    const updatedCartItems = cartItems.map((item) => {
      if (
        item._id === dish._id &&
        JSON.stringify(item.params) === JSON.stringify(params) &&
        item.option[0] === option[0]
      ) {
        dishInCart = true
        return {
          ...item,
          qty: item.qty + qty,
        }
      } else return item
    })

    dishInCart
      ? setCartItems(updatedCartItems)
      : setCartItems([...cartItems, { ...dish, qty, params, option }])

    toast.success(`${qty} ${dish.name}${qty > 1 ? "s" : ""} added to the cart.`)
  }

  const onRemove = (id, params, option) => {
    const newCartItems = []
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i]
      if (
        item._id === id &&
        JSON.stringify(item.params) === JSON.stringify(params) &&
        item.option[0] === option[0]
      ) {
        setTotalPrice((prev) => (prev -= item.price * item.qty))
        setTotalQuantities((prev) => (prev -= item.qty))
      } else newCartItems.push(item)
    }
    setCartItems(newCartItems)
  }

  const toggleCartItemQuantity = ({ id, params, option, value }) => {
    foundDish = cartItems.find(
      (item) =>
        item._id === id &&
        JSON.stringify(item.params) === JSON.stringify(params) &&
        item.option[0] === option[0]
    )

    if (value === "inc") {
      setTotalPrice((prev) => prev + foundDish.price)
      setTotalQuantities((prev) => prev + 1)
      setCartItems((prev) => {
        return prev.map((item) =>
          item._id === id &&
          JSON.stringify(item.params) === JSON.stringify(params) &&
          item.option[0] === option[0]
            ? { ...foundDish, qty: foundDish.qty + 1 }
            : item
        )
      })
    } else if (value === "dec") {
      if (foundDish.qty > 1) {
        setTotalPrice((prev) => prev - foundDish.price)
        setTotalQuantities((prev) => prev - 1)
        setCartItems((prev) => {
          return prev.map((item) =>
            item._id === id &&
            JSON.stringify(item.params) === JSON.stringify(params) &&
            item.option[0] === option[0]
              ? { ...foundDish, qty: foundDish.qty - 1 }
              : item
          )
        })
      }
    }
  }

  const incQty = () => {
    setQty((prevQty) => prevQty + 1)
  }

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1

      return prevQty - 1
    })
  }

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
