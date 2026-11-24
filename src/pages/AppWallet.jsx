import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react'
import { Card, money, formatDate, transactionLabel, primaryBtn } from '../../components/app/ui'

function AppWallet() {
  const { data, openTopUp } = useOutletContext()
  const [transactions, setTransactions] = useState(data.wallet.transactions)
  const balance = data.wallet.balance

  // Re-fetch the full history whenever the balance changes (e.g. after a top-up)
  useEffect(() => {
    fetch('/api/wallet', { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } })
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setTransactions(d.transactions)
      })
      .catch(() => {})
  }, [balance])

  return (
    <div className="space-y-6 max-w-2xl">
      <section className="rounded-3xl p-6 md:p-8 bg-linear-to-br from-orange-500 to-orange-700 text-white shadow-lg shadow-orange-900/20">
        <div className="flex items-center gap-2 text-orange-100 text-sm mb-1">
          <Wallet className="w-4 h-4" /> Food wallet
        </div>
        <p className="text-5xl font-bold mb-6">{money(balance)}</p>
        <button
          onClick={openTopUp}
          className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-5 py-3 rounded-xl hover:bg-orange-50 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add money
        </button>
        <p className="text-xs text-orange-100/80 mt-4">Pick "Wallet" at checkout to pay from your balance.</p>
      </section>

      <Card title="Activity">
        {transactions.length === 0 ? (
          <p className="text-neutral-600 text-sm">
            No wallet activity yet. Add some money and your top-ups and payments will show up here.
          </p>
        ) : (
          <div className="divide-y divide-neutral-200">
            {transactions.map((tx) => {
              const amount = parseFloat(tx.amount)
              const Icon = tx.type === 'refund' ? RotateCcw : amount >= 0 ? ArrowDownLeft : ArrowUpRight
              return (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        amount >= 0 ? 'bg-green-50 text-green-600' : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 truncate">{transactionLabel(tx)}</p>
                      <p className="text-xs text-neutral-400">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${amount >= 0 ? 'text-green-600' : 'text-neutral-800'}`}>
                      {amount >= 0 ? '+' : '−'}
                      {money(Math.abs(amount))}
                    </p>
                    <p className="text-xs text-neutral-400">Balance {money(tx.balance_after)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <button onClick={openTopUp} className={`${primaryBtn} w-full sm:hidden`}>
        <Plus className="w-4 h-4" /> Add money
      </button>
    </div>
  )
}

export default AppWallet