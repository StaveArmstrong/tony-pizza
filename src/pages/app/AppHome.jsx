import { useOutletContext, Link } from 'react-router-dom'
import TrendingBanner from '../../components/app/TrendingBanner'
import { ItemCard, CardRow, CenteredTitle, orangeBtn } from '../../components/app/ui'

function CardWrap({ children }) {
  return <div className="w-64 shrink-0 snap-start sm:w-auto">{children}</div>
}

function AppHome() {
  const { data } = useOutletContext()
  const { trending, recommendations, newDrops, stats } = data
  const isNewCustomer = stats.orderCount === 0

  return (
    <div>
      {/* Trending food: full-width banner, the nav floats on top of it */}
      {trending.length > 0 ? (
        <TrendingBanner items={trending} />
      ) : (
        <div className="max-w-md mx-auto px-6 pt-40 text-center">
          <div className="ap-card rounded-2xl p-8">
            <p className="ap-ink2 mb-4">The menu is empty right now. Check back soon.</p>
            <Link to="/menu" className={orangeBtn}>
              Open the menu
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 space-y-20">
        <section>
          <CenteredTitle
            title="Recommended for you"
            subtitle={
              isNewCustomer
                ? 'Customer favourites to start with. Order a few things and these get personal.'
                : 'Picked from what you order and what similar customers love'
            }
          />
          {recommendations.length > 0 ? (
            <CardRow>
              {recommendations.map((item) => (
                <CardWrap key={item.id}>
                  <ItemCard item={item} />
                </CardWrap>
              ))}
            </CardRow>
          ) : (
            <div className="ap-card rounded-2xl p-6 ap-ink2 text-sm text-center">
              You've tried everything we have. New dishes will show up here.
            </div>
          )}
        </section>

        <section>
          <CenteredTitle title="New drops" subtitle="Fresh on the menu in the last 30 days" />
          {newDrops.length > 0 ? (
            <CardRow>
              {newDrops.map((item) => (
                <CardWrap key={item.id}>
                  <ItemCard item={item} badge="New" />
                </CardWrap>
              ))}
            </CardRow>
          ) : (
            <div className="ap-card rounded-2xl p-6 ap-ink2 text-sm text-center">
              Nothing new this month. When we add something to the menu, you'll see it here first.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default AppHome