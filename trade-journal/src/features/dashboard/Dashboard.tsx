import { useMemo, useState } from "react"
import { useTradeStore } from "@/features/trades/tradeStore"
import { calculatePnL } from "@/lib"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar, ResponsiveContainer
} from "recharts"
import { TradesByDirectionBarChart } from "./TradesByDirectionBarChart"


const COLORS = ["#4ade80", "#f87171", "#60a5fa", "#facc15"]

export function Dashboard() {
  const trades = useTradeStore((s) => s.trades)
  const [strategyFilter, setStrategyFilter] = useState("All")
  const [directionFilter, setDirectionFilter] = useState("All")

  const filteredTrades = useMemo(() => {
    return trades
      .filter(t =>
        (strategyFilter === "All" || t.strategy === strategyFilter) &&
        (directionFilter === "All" || t.direction === directionFilter)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }, [trades, strategyFilter, directionFilter])

  const cumulativePnLData = useMemo(() => {
    let total = 0
    return filteredTrades.map(t => {
      const pnl = calculatePnL(t.entry, t.exit, t.size, t.direction)
      total += pnl
      return { date: new Date(t.createdAt).toLocaleDateString(), pnl, totalPnL: total }
    })
  }, [filteredTrades])

  const tradesByStrategy = useMemo(() => {
    const count: Record<string, number> = {}
    filteredTrades.forEach(t => {
      const strat = t.strategy || "Unassigned"
      count[strat] = (count[strat] || 0) + 1
    })
    return Object.entries(count).map(([name, value]) => ({ name, value }))
  }, [filteredTrades])

  const tradesByDirection = useMemo(() => {
    const count: Record<string, number> = { long: 0, short: 0 }
    filteredTrades.forEach(t => count[t.direction]++)
    return Object.entries(count).map(([name, value]) => ({ name, value }))
  }, [filteredTrades])

  const totalPnL = filteredTrades.reduce(
    (sum, t) => sum + calculatePnL(t.entry, t.exit, t.size, t.direction),
    0
  )
  const totalTrades = filteredTrades.length
  const winningTrades = filteredTrades.filter(
    t => calculatePnL(t.entry, t.exit, t.size, t.direction) > 0
  ).length
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

  const summaryCards = [
    { label: "Total PnL", value: `$${totalPnL.toFixed(2)}`, icon: totalPnL >= 0 ? <FaArrowUp /> : <FaArrowDown />, color: totalPnL >= 0 ? "text-green-400" : "text-red-400" },
    { label: "Total Trades", value: totalTrades, icon: <FaChartLine /> },
    { label: "Winning Trades", value: winningTrades, icon: <FaBullseye /> },
    { label: "Win Rate", value: `${winRate.toFixed(1)}%`, icon: <FaBullseye /> }
  ]

  return (
    <div className="p-6 bg-gray-950 min-h-screen space-y-8">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <select
          value={strategyFilter}
          onChange={(e) => setStrategyFilter(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
        >
          <option>All</option>
          <option>Breakout</option>
          <option>Reversal</option>
          <option>Scalping</option>
          <option>Swing</option>
        </select>
        <select
          value={directionFilter}
          onChange={(e) => setDirectionFilter(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded-xl focus:ring-2 focus:ring-blue-400 transition"
        >
          <option>All</option>
          <option>long</option>
          <option>short</option>
        </select>
      </div>

     
    </div>
  )
}
