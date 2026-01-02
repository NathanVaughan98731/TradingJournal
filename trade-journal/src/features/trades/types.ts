export type Trade = {
  id: string
  symbol: string
  direction: "long" | "short"
  entry: number
  exit: number
  size: number
  pnl: number
  rr: number
  createdAt: string
  strategy: string // <-- new field
}
