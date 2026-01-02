export type Direction = "long" | "short"

export const calculatePnL = (
  entry: number,
  exit: number,
  size: number,
  direction: Direction
) => {
  return direction === "long"
    ? (exit - entry) * size
    : (entry - exit) * size
}
