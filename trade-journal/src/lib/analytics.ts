import { Trade } from "@/features/trades/types"

export const winRate = (trades: Trade[]) =>
  trades.length === 0 ? 0 : trades.filter(t => t.pnl > 0).length / trades.length

export const expectancy = (trades: Trade[]) => {
  const wins = trades.filter(t => t.pnl > 0)
  const losses = trades.filter(t => t.pnl < 0)

  if (!wins.length || !losses.length) return 0

  const avgWin = wins.reduce((s, t) => s + t.pnl, 0) / wins.length
  const avgLoss = Math.abs(
    losses.reduce((s, t) => s + t.pnl, 0) / losses.length
  )

  return winRate(trades) * avgWin - (1 - winRate(trades)) * avgLoss
}

export const maxDrawdown = (trades: Trade[]) => {
  let peak = 0
  let balance = 0
  let maxDD = 0

  trades.forEach(t => {
    balance += t.pnl
    peak = Math.max(peak, balance)
    maxDD = Math.min(maxDD, balance - peak)
  })

  return maxDD
}
