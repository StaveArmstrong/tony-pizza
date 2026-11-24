import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

function loadCart() {
  try {
    const saved = localStorage.getItem('tonyPizzaCart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem('tonyPizzaCart', JSON.stringify(cartItems))
  }, [cartItems])

  // A "line" is unique per pizza + size + topping combo, so ordering the
  // same pizza twice with different toppings shows as two separate rows.
  const addItem = ({ menuItemId, name, image, sizeId, sizeLabel, toppingIds, toppingsLabel, unitPrice }) => {
    const key = `${menuItemId}-${sizeId}-${[...toppingIds].sort().join(',')}`

    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        { key, menuItemId, name, image, sizeId, sizeLabel, toppingIds, toppingsLabel, unitPrice, quantity: 1 },
      ]
    })
  }

  const removeItem = (key) => {
    setCartItems((prev) => prev.filter((i) => i.key !== key))
  }

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) return removeItem(key)
    setCartItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
  }

  const clearCart = () => setCartItems([])

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const cartTotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cartItems, addItem, removeItem, updateQuantity, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside a CartProvider')
  return ctx
}