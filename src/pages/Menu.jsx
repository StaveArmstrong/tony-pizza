import { useState, useEffect } from 'react'
import MenuBanner from '../components/MenuBanner'
import MenuHybrid from '../components/MenuHYbrid' 

function Menu() {
  const [items, setItems] = useState([])
  const [toppings, setToppings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/menu').then((res) => {
        if (!res.ok) throw new Error('Failed to load menu')
        return res.json()
      }),
      fetch('/api/menu/toppings').then((res) => {
        if (!res.ok) throw new Error('Failed to load toppings')
        return res.json()
      }),
    ])
      .then(([menuData, toppingsData]) => {
        setItems(menuData)
        setToppings(toppingsData)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#f4ede1]">
      <MenuBanner />

      <div className="pt-16 pb-24 px-8">
        <h1 className="text-5xl md:text-6xl text-center text-neutral-800 mb-4" style={{ fontFamily: "'Dancing Script', cursive" }}>
          Our Menu
        </h1>
        <p className="text-center text-neutral-500 mb-16">Fresh, hand-tossed, made to order</p>

        {loading && <p className="text-center text-neutral-500">Loading menu...</p>}
        {error && <p className="text-center text-red-600">Couldn't load the menu: {error}</p>}
        {!loading && !error && items.length > 0 && <MenuHybrid items={items} toppings={toppings} />}
      </div>
    </div>
  )
}

export default Menu