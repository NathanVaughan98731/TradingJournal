import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Trade } from "@/features/trades/types"
import { motion } from "framer-motion"

type Props = {
  trades: Trade[]
}

export function EquityCurve({ trades }: Props) {
  let cumulative = 0

  const data = trades
    .slice()
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )
    .map((t, i) => {
      cumulative += t.pnl
      return {
        index: i + 1,
        equity: cumulative,
      }
    })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-900 rounded-xl p-4 shadow-lg"
    >
      <h2 className="text-white font-semibold mb-3">
        Equity Curve
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#2a2a2a" strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            stroke="#9ca3af"
            tickLine={false}
          />
          <YAxis
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderRadius: "8px",
              border: "none",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Equity"]}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#4ade80"
            strokeWidth={3}
            dot={false}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
