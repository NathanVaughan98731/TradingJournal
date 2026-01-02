import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: { name: string; value: number }[]
}

export function TradesByDirectionBarChart({ data }: Props) {
  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-xl">
      <h3 className="text-white mb-2 text-lg font-semibold">
        Trades by Direction
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#444" strokeDasharray="5 5" />

          <XAxis
            dataKey="name"
            stroke="#fff"
            tick={{ fill: "#fff" }}
          />

          <YAxis
            stroke="#fff"
            tick={{ fill: "#fff" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: 8,
            }}
            itemStyle={{ color: "#fff" }}
            formatter={(value, name) => [
              `${value ?? 0} trades`,
              name ?? "",
            ]}
          />

          <Bar
            dataKey="value"
            barSize={50}
            radius={[6, 6, 0, 0]}
            fill="#60a5fa"
            label={{ fill: "#fff", position: "top" }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
