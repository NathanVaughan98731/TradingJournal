import { TradeForm } from "@/features/trades/TradeForm"
import { TradeTable } from "@/features/trades/TradeTable"
import { useTradeStore } from "@/features/trades/tradeStore"

export default function TradesPage() {
  const trades = useTradeStore((s) => s.trades)
  const undo = useTradeStore((s) => s.undo)
  const redo = useTradeStore((s) => s.redo)

  return (
    <div className="p-4 space-y-6">
      <div className="flex gap-2">
        <button
          onClick={undo}
          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500 transition-colors"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500 transition-colors"
        >
          Redo
        </button>
      </div>

      <h2 className="text-2xl text-white font-bold">Add New Trade</h2>
      <TradeForm />
      <h2 className="text-2xl text-white font-bold">All Trades</h2>
      <TradeTable trades={trades} />
    </div>
  )
}
