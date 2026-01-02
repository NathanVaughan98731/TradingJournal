import { useState } from "react"
import { Trade } from "./types"
import { useTradeStore } from "./tradeStore"
import { calculatePnL } from "@/lib"


type TradeTableProps = {
  trades: Trade[]
}

export function TradeTable({ trades }: TradeTableProps) {
  const deleteTrade = useTradeStore((s) => s.deleteTrade)
  const updateTrade = useTradeStore((s) => s.updateTrade)

  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)
  const [tempTrade, setTempTrade] = useState<Partial<Trade>>({})

  const STRATEGIES = ["Breakout", "Reversal", "Scalping", "Swing"]

  const startEdit = (trade: Trade) => {
    setEditingTrade(trade)
    setTempTrade(trade)
  }

  const saveEdit = () => {
    if (!editingTrade) return
    updateTrade(editingTrade.id, tempTrade)
    setEditingTrade(null)
  }

  const cancelEdit = () => setEditingTrade(null)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-center table-auto border-collapse">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-4 py-2 border border-gray-700">#</th>
            <th className="px-4 py-2 border border-gray-700">Symbol</th>
            <th className="px-4 py-2 border border-gray-700">Direction</th>
            <th className="px-4 py-2 border border-gray-700">Entry</th>
            <th className="px-4 py-2 border border-gray-700">Exit</th>
            <th className="px-4 py-2 border border-gray-700">Size</th>
            <th className="px-4 py-2 border border-gray-700">PnL</th>
            <th className="px-4 py-2 border border-gray-700">RR</th>
            <th className="px-4 py-2 border border-gray-700">Strategy</th>
            <th className="px-4 py-2 border border-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades
            .slice()
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((trade, index) => (
              <tr key={trade.id} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <td className="px-4 py-2 border border-gray-700">{index + 1}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.symbol}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.direction}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.entry}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.exit}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.size}</td>
                <td className={`px-4 py-2 border border-gray-700 ${
                calculatePnL(trade.entry, trade.exit, trade.size, trade.direction) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}>
                {calculatePnL(trade.entry, trade.exit, trade.size, trade.direction).toFixed(2)}
                </td>

                <td className="px-4 py-2 border border-gray-700">{trade.rr}</td>
                <td className="px-4 py-2 border border-gray-700">{trade.strategy}</td>
                <td className="px-4 py-2 border border-gray-700 flex justify-center gap-2">
                  <button
                    onClick={() => startEdit(trade)}
                    className="bg-yellow-600 px-2 py-1 rounded hover:bg-yellow-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTrade(trade.id)}
                    className="bg-red-600 px-2 py-1 rounded hover:bg-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-80 flex flex-col gap-4 shadow-lg">
            <h3 className="text-white text-lg font-semibold">Edit Trade</h3>

            <select
  className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
  value={tempTrade.direction ?? editingTrade.direction}
  onChange={(e) => setTempTrade({ ...tempTrade, direction: e.target.value as "long" | "short" })}
>
  <option value="long">Long</option>
  <option value="short">Short</option>
</select>
            <input
              type="number"
              className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Entry"
              value={tempTrade.entry}
              onChange={(e) => setTempTrade({ ...tempTrade, entry: +e.target.value })}
            />
            <input
              type="number"
              className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Exit"
              value={tempTrade.exit}
              onChange={(e) => setTempTrade({ ...tempTrade, exit: +e.target.value })}
            />
            <input
              type="number"
              className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholder="Size"
              value={tempTrade.size}
              onChange={(e) => setTempTrade({ ...tempTrade, size: +e.target.value })}
            />
            <input
              type="number"
              className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
              placeholder="RR"
              value={tempTrade.rr}
              onChange={(e) => setTempTrade({ ...tempTrade, rr: +e.target.value })}
            />
            <select
              className="bg-gray-800 text-white p-2 rounded focus:ring-2 focus:ring-blue-400"
              value={tempTrade.strategy}
              onChange={(e) => setTempTrade({ ...tempTrade, strategy: e.target.value })}
            >
              {STRATEGIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEdit}
                className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
