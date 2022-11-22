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

  const onAdd = ({ dish, paramsState, optionState, priceState }) => {
    // here we redefine variables to avoid using a state
    const params = paramsState
    const option = optionState
    const price = priceState
    if (dish._type === "dish") {
      // here we remove 'moderate' because it may interrupt the comparing system
      const keys = Object.keys(params)
      for (let i = 0; i < keys.length; i++) {
        const param = keys[i]
        if (params[param] === "moderate") delete params[param]
      }
    }

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + (price || dish.price) * qty
    )
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + qty)

    const found = cartItems.find((item) => {
      if (dish._type === "pack") {
        return item._id === dish._id && item._type === "pack"
      } else {
        return (
          item._id === dish._id &&
          JSON.stringify(item.params) === JSON.stringify(params) &&
          item.option === option
        )
      }
    })

    const updatedCartItems = cartItems.map((item) => {
      if (item._id === dish._id) {
        if (item._type === "pack" && dish._type === "pack") {
          return { ...item, qty: item.qty + qty }
        } else if (
          JSON.stringify(item.params) === JSON.stringify(params) &&
          item.option === option
        ) {
          return {
            ...item,
            qty: item.qty + qty,
          }
        } else return item
      } else return item
    })

    if (found) setCartItems(updatedCartItems)
    else {
      dish._type === "dish"
        ? setCartItems((prev) => [
            ...prev,
            { ...dish, qty, params, option, price },
          ])
        : setCartItems((prev) => [...prev, { ...dish, qty }])
    }

    toast.success(`${qty} ${dish.name}${qty > 1 ? "s" : ""} added to the cart.`)
  }

  const onRemove = ({ dish }) => {
    const newCartItems = []
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i]
      if (item._id === dish._id) {
        if (dish._type === "pack") {
          setTotalPrice(
            (prev) => (prev -= item.price * item.qty)
          )
          setTotalQuantities((prev) => (prev -= item.qty))
        } else if (
          JSON.stringify(item.params) === JSON.stringify(dish.params) &&
          item.option &&
          item.option === dish.option
        ) {
          setTotalPrice(
            (prev) => (prev -= item.price * item.qty)
          )
          setTotalQuantities((prev) => (prev -= item.qty))
        } else newCartItems.push(item)
      } else newCartItems.push(item)
    }
    setCartItems(newCartItems)
  }

  const toggleCartItemQuantity = ({ dish, value }) => {
    const updatedCartItems = cartItems.map((item) => {
      const ableToDecrease = () => {
        if (value < 0 && item.qty > 1) return true
        if (value < 0 && item.qty <= 1) return false
        else return true
      }
      if (item._id === dish._id && ableToDecrease()) {
        if (item._type === "pack" && dish._type === "pack") {
          setTotalQuantities((prev) => prev + value)
          setTotalPrice((prev) => prev + value * item.price)
          return { ...item, qty: item.qty + value }
        } else if (
          JSON.stringify(item.params) === JSON.stringify(dish.params) &&
          item.option === dish.option
        ) {
          setTotalQuantities((prev) => prev + value)
          setTotalPrice((prev) => prev + value * item.price)
          return { ...item, qty: item.qty + value }
        } else return item
      } else return item
    })

    setCartItems(updatedCartItems)
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
