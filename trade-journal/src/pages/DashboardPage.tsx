import { useState, useMemo } from "react"
import { useTradeStore } from "@/features/trades/tradeStore"
import { StatCard } from "@/components/StatCard"
import { EquityCurve } from "@/features/dashboard/EquityCurve"
import { StrategySummary } from "@/features/dashboard/StrategySummary"
import { TradeTable } from "@/features/trades/TradeTable"
import { winRate, expectancy, maxDrawdown } from "@/lib"

export default function DashboardPage() {
  const trades = useTradeStore((s) => s.trades)
  const [strategyFilter, setStrategyFilter] = useState<string | null>(null)

  // Filtered trades for table & charts
  const filteredTrades = useMemo(
    () =>
      trades.filter((t) =>
        strategyFilter ? t.strategy === strategyFilter : true
      ),
    [trades, strategyFilter]
  )

  const totalPnL = filteredTrades.reduce((sum, t) => sum + t.pnl, 0)
  const avgWin =
    filteredTrades.filter((t) => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0) /
    Math.max(filteredTrades.filter((t) => t.pnl > 0).length, 1)
  const avgLoss =
    filteredTrades.filter((t) => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0) /
    Math.max(filteredTrades.filter((t) => t.pnl < 0).length, 1)

  return (
    <div className="space-y-6 p-4">
      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Trades" value={filteredTrades.length} />
        <StatCard
          label="Total PnL"
          value={`$${totalPnL.toFixed(2)}`}
          color={totalPnL >= 0 ? "text-green-400" : "text-red-400"}
        />
        <StatCard
          label="Win Rate"
          value={`${(winRate(filteredTrades) * 100).toFixed(1)}%`}
        />
        <StatCard label="Expectancy" value={expectancy(filteredTrades).toFixed(2)} />
        <StatCard
          label="Avg Win"
          value={`$${avgWin.toFixed(2)}`}
          color="text-green-400"
        />
        <StatCard
          label="Avg Loss"
          value={`$${Math.abs(avgLoss).toFixed(2)}`}
          color="text-red-400"
        />
        <StatCard
          label="Max Drawdown"
          value={`$${Math.abs(maxDrawdown(filteredTrades)).toFixed(2)}`}
          color="text-red-400"
        />
      </div>

      {/* Equity Curve */}
      <EquityCurve trades={filteredTrades} />

      {/* Strategy summary */}
      <StrategySummary
        trades={trades}
        onStrategySelect={(strategy) => setStrategyFilter(strategy)}
      />

      {/* Trades table */}
      <TradeTable trades={filteredTrades} />
    </div>
  )
}
