import { useState } from "react"
import { useTradeStore } from "./tradeStore"
import { calculatePnL } from "@/lib"

const STRATEGIES = ["Breakout", "Reversal", "Scalping", "Swing"]

export function TradeForm() {
  const addTrade = useTradeStore((s) => s.addTrade)

  const [form, setForm] = useState({
    symbol: "",
    direction: "long" as "long" | "short",
    entry: 0,
    exit: 0,
    size: 1,
    rr: 1,
    strategy: STRATEGIES[0],
  })

  const pnl = calculatePnL(form.entry, form.exit, form.size, form.direction)

  const submit = () => {
    if (!form.symbol) return alert("Enter a symbol")
    addTrade({
      id: crypto.randomUUID(),
      symbol: form.symbol.toUpperCase(),
      direction: form.direction,
      entry: form.entry,
      exit: form.exit,
      size: form.size,
      pnl,
      rr: form.rr,
      strategy: form.strategy,
      createdAt: new Date().toISOString(),
    })
    setForm({ ...form, symbol: "", entry: 0, exit: 0 })
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl flex flex-col gap-4 shadow-lg hover:shadow-2xl transition-shadow">
      <input
        className="bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Symbol"
        value={form.symbol}
        onChange={(e) => setForm({ ...form, symbol: e.target.value })}
      />
      <select
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        value={form.direction}
        onChange={(e) =>
          setForm({ ...form, direction: e.target.value as "long" | "short" })
        }
      >
        <option value="long">Long</option>
        <option value="short">Short</option>
      </select>
      <input
        type="number"
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Entry"
        value={form.entry}
        onChange={(e) => setForm({ ...form, entry: +e.target.value })}
      />
      <input
        type="number"
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Exit"
        value={form.exit}
        onChange={(e) => setForm({ ...form, exit: +e.target.value })}
      />
      <input
        type="number"
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="Size"
        value={form.size}
        onChange={(e) => setForm({ ...form, size: +e.target.value })}
      />
      <input
        type="number"
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        placeholder="RR"
        value={form.rr}
        onChange={(e) => setForm({ ...form, rr: +e.target.value })}
      />
      <select
        className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
        value={form.strategy}
        onChange={(e) => setForm({ ...form, strategy: e.target.value })}
      >
        {STRATEGIES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className={pnl >= 0 ? "text-green-400" : "text-red-400"}>
        PnL: ${pnl.toFixed(2)}
      </div>

      <button
        onClick={submit}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition-colors"
      >
        Add Trade
      </button>
    </div>
  )
}
