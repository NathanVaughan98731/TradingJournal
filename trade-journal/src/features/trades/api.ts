import { Trade } from "@/features/trades/types"

/**
 * Calculate PnL for a single trade
 */
export function calculatePnL(entry: number, exit: number, size: number, direction: "long" | "short") {
  return (exit - entry) * size * (direction === "long" ? 1 : -1)
}

/**
 * Dashboard metrics
 */
export function getDashboardMetrics(trades: Trade[]) {
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)

  const wins = trades.filter((t) => t.pnl > 0)
  const losses = trades.filter((t) => t.pnl <= 0)

  const winRate = trades.length ? wins.length / trades.length : 0

  const avgWin = wins.length ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length : 0
  const avgLoss = losses.length ? losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length : 0

  // Max Drawdown
  let peak = 0
  let drawdown = 0
  let maxDrawdown = 0
  trades
    .slice()
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .forEach((t) => {
      peak = Math.max(peak, totalPnL - drawdown + t.pnl)
      drawdown = totalPnL - peak
      if (drawdown < maxDrawdown) maxDrawdown = drawdown
    })

  return {
    totalPnL,
    winRate,
    avgWin,
    avgLoss,
    maxDrawdown,
  }
}

/**
 * Group trades by strategy
 */
export function getTradesByStrategy(trades: Trade[]) {
  const strategyMap: Record<
    string,
    { trades: Trade[]; totalPnL: number; winRate: number }
  > = {}

  trades.forEach((t) => {
    const strategy = t.strategy || "Unassigned"
    if (!strategyMap[strategy]) strategyMap[strategy] = { trades: [], totalPnL: 0, winRate: 0 }
    strategyMap[strategy].trades.push(t)
    strategyMap[strategy].totalPnL += t.pnl
  })

  // Calculate win rate per strategy
  Object.keys(strategyMap).forEach((strategy) => {
    const s = strategyMap[strategy]
    s.winRate = s.trades.length ? s.trades.filter((t) => t.pnl > 0).length / s.trades.length : 0
  })

  return strategyMap
}
