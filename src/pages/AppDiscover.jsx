import { useOutletContext, Link } from 'react-router-dom'
import { Heart, Sparkles } from 'lucide-react'
import { ItemCard, primaryBtn } from '../../components/app/ui'

function AppDiscover() {
  const { data } = useOutletContext()
  const { recommendations, newDrops, favorites, topToppings } = data

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold italic text-neutral-800 flex items-center gap-2 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          <Heart className="w-5 h-5 text-orange-500" /> Picked for you
        </h2>
        <p className="text-sm text-neutral-400 mb-4">
          {favorites.length > 0
            ? `Based on what you order${topToppings.length > 0 ? ` (you love ${topToppings[0].name.toLowerCase()})` : ''} and what customers with similar taste enjoy.`
            : 'Customer favourites to get you started. Order a few things and these will get more personal.'}
        </p>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendations.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
        {recommendations.length === 0 && (
          <p className="text-neutral-600 text-sm">Nothing to suggest yet. Check back after your next order.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold italic text-neutral-800 flex items-center gap-2 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          <Sparkles className="w-5 h-5 text-orange-500" /> New drops
        </h2>
        <p className="text-sm text-neutral-400 mb-4">Fresh additions to the menu from the last 30 days.</p>
        {newDrops.length === 0 ? (
          <p className="text-neutral-600 text-sm">No new items this month. New menu additions will appear here first.</p>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
            {newDrops.map((item) => (
              <ItemCard key={item.id} item={item} badge="New" />
            ))}
          </div>
        )}
      </section>

      <Link to="/menu" className={`${primaryBtn} w-full sm:w-auto`}>
        See the full menu
      </Link>
    </div>
  )
}

export default AppDiscover