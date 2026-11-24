import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { getMenuImage, categoryLabels, categoryOrder } from '../utils/menuImages'
import { useCart } from '../context/CartContext' 

  function MenuRow({ item, toppings }) {
    const [justAdded, setJustAdded] = useState(false) 
  const { addItem } = useCart()
  const [expanded, setExpanded] = useState(false)
  const [selectedSizeId, setSelectedSizeId] = useState(item.sizes[0]?.id)
  const [selectedToppingIds, setSelectedToppingIds] = useState([])
  const selectedSize = item.sizes.find((s) => s.id === selectedSizeId)
  const image = getMenuImage(item.name)
  const isPizza = (item.category ?? 'pizza') === 'pizza'

  const toggleTopping = (id) =>
    setSelectedToppingIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))

  const toppingsTotal = isPizza
    ? selectedToppingIds.reduce((sum, id) => {
        const t = toppings.find((tp) => tp.id === id)
        return sum + (t ? parseFloat(t.price) : 0)
      }, 0)
    : 0
  const totalPrice = parseFloat(selectedSize?.price ?? 0) + toppingsTotal

  return (
    <div className="border-b border-dashed border-neutral-300 last:border-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-5 py-5 text-left"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center shrink-0">
          {image ? (
            <img src={image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-neutral-400 text-[10px]">No photo</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className="text-xl font-bold italic text-neutral-800"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {item.name}
          </h3>
          <p className="text-sm text-neutral-500">
            {item.sizes.map((s) => s.size).join(' · ')}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg font-bold text-neutral-800">
            {item.sizes.length > 0
              ? `From $${Math.min(...item.sizes.map((s) => parseFloat(s.price))).toFixed(2)}`
              : '—'}
          </span>
        </div>

        <ChevronDown
          className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="pb-6 pl-[5.25rem]">
          {item.sizes.length > 0 ? (
            <>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 block">
                Size
              </span>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSizeId(size.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                      selectedSizeId === size.id
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-neutral-600 border-neutral-300 hover:border-orange-400'
                    }`}
                  >
                    {size.size} — ${parseFloat(size.price).toFixed(2)}
                  </button>
                ))}
              </div>

              {isPizza && toppings.length > 0 && (
                <>
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2 block">
                    Toppings
                  </span>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {toppings.map((topping) => {
                      const isSelected = selectedToppingIds.includes(topping.id)
                      return (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            isSelected
                              ? 'bg-neutral-800 text-white border-neutral-800'
                              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          {topping.name} (+${parseFloat(topping.price).toFixed(2)})
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

            <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-neutral-800">${totalPrice.toFixed(2)}</span>
              <button
                onClick={() => {
                    addItem({
                    menuItemId: item.id,
                    name: item.name,
                    image: image,
                    sizeId: selectedSizeId,
                    sizeLabel: selectedSize?.size ?? '',
                    toppingIds: selectedToppingIds,
                    toppingsLabel: selectedToppingIds
                        .map((id) => toppings.find((t) => t.id === id)?.name)
                        .filter(Boolean)
                        .join(', '),
                    unitPrice: totalPrice,
                    })
                    setJustAdded(true)
                    setTimeout(() => setJustAdded(false), 1200)
                }}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-colors ${
                    justAdded ? 'bg-green-600 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
                >
                {justAdded ? 'Added ✓' : 'Add to Cart'}
                </button>
             </div>
            </>
          ) : (
            <p className="text-neutral-400 text-sm">No sizes available</p>
          )}
        </div>
      )}
    </div>
  )
}

function MenuHybrid({ items, toppings }) {
  const availableCategories = categoryOrder.filter((cat) => items.some((i) => (i.category ?? 'pizza') === cat))
  const [activeCategory, setActiveCategory] = useState(availableCategories[0])
  const filtered = items.filter((i) => (i.category ?? 'pizza') === activeCategory)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-center gap-2 mb-10 flex-wrap border-b border-neutral-300 pb-6">
        {availableCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-orange-500 text-white'
                : 'bg-white text-neutral-600 border border-neutral-300 hover:border-orange-400'
            }`}
          >
            {categoryLabels[cat] ?? cat}
          </button>
        ))}
      </div>

      <div>
        {filtered.map((item) => (
          <MenuRow key={item.id} item={item} toppings={toppings} />
        ))}
      </div>
    </div>
  )
}

export default MenuHybrid