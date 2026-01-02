import { motion } from "framer-motion"
import CountUp from "react-countup"

type StatCardProps = {
  label: string
  value: string | number
  color?: string
}

export function StatCard({ label, value, color = "text-white" }: StatCardProps) {
  const numericValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value

  const isNumber = !isNaN(numericValue)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="bg-gray-900 rounded-xl p-4 shadow-lg"
    >
      <p className="text-sm text-gray-400">{label}</p>

      <p className={`text-2xl font-semibold mt-1 ${color}`}>
        {isNumber ? (
          <CountUp
            end={numericValue}
            duration={0.8}
            separator=","
            decimals={Number.isInteger(numericValue) ? 0 : 2}
            prefix={typeof value === "string" && value.includes("$") ? "$" : ""}
            suffix={typeof value === "string" && value.includes("%") ? "%" : ""}
          />
        ) : (
          value
        )}
      </p>
    </motion.div>
  )
}
