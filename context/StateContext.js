import { createContext, useContext, useState } from "react"
import { toast } from "react-hot-toast"

const Context = createContext()

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [totalQuantities, setTotalQuantities] = useState(0)
  const [qty, setQty] = useState(1)

  let foundDish

  const onAdd = (dish, quantity) => {
    const checkDishInCart = cartItems.find((item) => item._id === dish._id)

    setTotalPrice((prevTotalPrice) => prevTotalPrice + dish.price * quantity)
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity)

    if (checkDishInCart) {
      const updatedCartItems = cartItems.map((cartDish) => {
        if (cartDish._id === dish._id)
          return {
            ...cartDish,
            quantity: cartDish.quantity + quantity,
          }
      })

      setCartItems(updatedCartItems)
    } else {
      dish.quantity = quantity

      setCartItems([...cartItems, { ...dish }])
    }

    toast.success(`${qty} ${dish.name} added to the cart.`)
  }

  const onRemove = (id) => {
    foundDish = cartItems.find((item) => item._id === id)
    const newCartItems = cartItems.filter(item => item._id !== id )

    setTotalPrice(prev => prev -= foundDish.price * foundDish.quantity)
    setTotalQuantities(prev => prev -= foundDish.quantity)
    
    setCartItems(newCartItems)
  }

  const toggleCartItemQuantity = (id, value) => {
    foundDish = cartItems.find((item) => item._id === id)

    if (value === "inc") {
      setTotalPrice((prev) => prev + foundDish.price)
      setTotalQuantities((prev) => prev + 1)
      setCartItems((prev) => {
        return prev.map((item) =>
          item._id === id
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
            item._id === id
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
        onRemove
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useStateContext = () => useContext(Context)
