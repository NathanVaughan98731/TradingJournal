import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Trade } from "@/features/trades/types"
import { motion } from "framer-motion"
import { useState } from "react"


type Props = {
  trades: Trade[]
}

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"]

export function StrategySummary({ trades }: Props) {
  const strategyCounts = trades.reduce<Record<string, number>>((acc, t) => {
    const strategy = t.strategy || "Unassigned"
    acc[strategy] = (acc[strategy] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(strategyCounts).map(([name, value]) => ({
    name,
    value,
  }))

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 p-4 rounded-xl text-gray-400">
        No trades yet
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-900 p-4 rounded-xl shadow-lg"
    >
      <h2 className="text-white font-semibold mb-3">
        Trades by Strategy
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={3}
            animationDuration={800}
          >
{data.map((_, index) => (
  <Cell
    key={index}
    fill={COLORS[index % COLORS.length]}
    style={{ cursor: "pointer" }}
    className="transition-all duration-300 ease-out"
  />
))}

          </Pie>

            <Tooltip
            contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: 8,
            }}
            itemStyle={{ color: "#fff" }}
            labelStyle={{ color: "#fff" }}   // ✅ THIS FIXES BLACK TEXT
            formatter={(value, name) => [
                `${value ?? 0} trades`,
                name ?? "",
            ]}
            />

          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{
              color: "#d1d5db",
              fontSize: "13px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

