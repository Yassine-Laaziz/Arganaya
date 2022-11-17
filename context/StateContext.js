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
  useEffect(async () => {
    // these will after be filtered incase user modifies localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || null
    const totalQty = cart?.reduce((total, cartItem) => {
      return total + cartItem.quantity
    }, 0)
    const totalPrice = cart?.reduce((total, cartItem) => {
      return total + cartItem.price * cartItem.quantity
    }, 0)
    setCartItems(cart || [])
    setTotalQuantities(totalQty || 0)
    setTotalPrice(totalPrice || 0)
  }, [])
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  let foundDish

  const onAdd = (dish, quantity, chosenOptions) => {
    const entries = Object.entries(chosenOptions)
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i]
      if (entry[1] === "moderate") delete chosenOptions[entry[0]]
    }
    const checkDishInCart = cartItems.find(
      (item) =>
        item._id === dish._id &&
        JSON.stringify(item.chosenOptions) === JSON.stringify(chosenOptions)
    )

    setTotalPrice((prevTotalPrice) => prevTotalPrice + dish.price * quantity)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

    if (checkDishInCart) {
      const updatedCartItems = cartItems.map((cartDish) => {
        if (
          cartDish._id === dish._id &&
          JSON.stringify(cartDish.chosenOptions) ===
            JSON.stringify(chosenOptions)
        ) {
          return {
            ...cartDish,
            chosenOptions,
            quantity: cartDish.quantity + quantity,
          }
        } else return cartDish
      })

      setCartItems(updatedCartItems)
    } else {
      setCartItems([...cartItems, { ...dish, quantity, chosenOptions }])
    }

    toast.success(
      `${quantity} ${dish.name}${quantity > 1 ? "s" : ""} added to the cart.`
    )
  }

  const onRemove = (id, chosenOptions) => {
    foundDish = cartItems.find(
      (item) =>
        item._id === id &&
        JSON.stringify(item.chosenOptions) === JSON.stringify(chosenOptions)
    )
    const newCartItems = cartItems.filter(
      (item) => item._id !== id || item.chosenOptions !== chosenOptions
    )

    setTotalPrice((prev) => (prev -= foundDish.price * foundDish.quantity))
    setTotalQuantities((prev) => (prev -= foundDish.quantity))

    setCartItems(newCartItems)
  }

  const toggleCartItemQuantity = (id, chosenOptions, value) => {
    foundDish = cartItems.find(
      (item) =>
        item._id === id &&
        JSON.stringify(item.chosenOptions) === JSON.stringify(chosenOptions)
    )

    if (value === "inc") {
      setTotalPrice((prev) => prev + foundDish.price)
      setTotalQuantities((prev) => prev + 1)
      setCartItems((prev) => {
        return prev.map((item) =>
          item._id === id &&
          JSON.stringify(item.chosenOptions) === JSON.stringify(chosenOptions)
            ? { ...foundDish, quantity: foundDish.quantity + 1 }
            : item
        )
      })
    } else if (value === "dec") {
      if (foundDish.quantity > 1) {
        setTotalPrice((prev) => prev - foundDish.price)
        setTotalQuantities((prev) => prev - 1)
        setCartItems((prev) => {
          return prev.map((item) =>
            item._id === id &&
            JSON.stringify(item.chosenOptions) === JSON.stringify(chosenOptions)
              ? { ...foundDish, quantity: foundDish.quantity - 1 }
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
