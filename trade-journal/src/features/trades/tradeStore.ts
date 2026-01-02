// File: src/features/trades/tradeStore.ts
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Trade } from "./types"
import { calculatePnL } from "@/lib"


type TradeAction = {
  type: "add" | "delete" | "update"
  trade: Trade
  prevTrade?: Trade // for updates
}

type TradeState = {
  trades: Trade[]
  addTrade: (trade: Trade) => void
  deleteTrade: (id: string) => void
  updateTrade: (id: string, newTrade: Partial<Trade>) => void
  undoStack: TradeAction[]
  redoStack: TradeAction[]
  undo: () => void
  redo: () => void
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set, get) => ({
      trades: [],
      undoStack: [],
      redoStack: [],
      addTrade: (trade) => {
        set((state) => ({
          trades: [...state.trades, trade],
          undoStack: [...state.undoStack, { type: "add", trade }],
          redoStack: [],
        }))
      },
      deleteTrade: (id) => {
        const trade = get().trades.find((t) => t.id === id)
        if (!trade) return
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
          undoStack: [...state.undoStack, { type: "delete", trade }],
          redoStack: [],
        }))
      },
      updateTrade: (id, newTrade) => {
  const trades = get().trades
  const index = trades.findIndex((t) => t.id === id)
  if (index === -1) return
  const oldTrade = trades[index]
  const updatedTrade = {
    ...oldTrade,
    ...newTrade,
    pnl: calculatePnL(
      newTrade.entry ?? oldTrade.entry,
      newTrade.exit ?? oldTrade.exit,
      newTrade.size ?? oldTrade.size,
      newTrade.direction ?? oldTrade.direction
    )
  }
  trades[index] = updatedTrade
  set({
    trades,
    undoStack: [...get().undoStack, { type: "update", trade: updatedTrade, prevTrade: oldTrade }],
    redoStack: [],
  })
},

      undo: () => {
        const stack = get().undoStack
        if (!stack.length) return
        const action = stack[stack.length - 1]
        const trades = [...get().trades]

        switch (action.type) {
          case "add":
            set({
              trades: trades.filter((t) => t.id !== action.trade.id),
              undoStack: stack.slice(0, -1),
              redoStack: [...get().redoStack, action],
            })
            break
          case "delete":
            set({
              trades: [...trades, action.trade],
              undoStack: stack.slice(0, -1),
              redoStack: [...get().redoStack, action],
            })
            break
          case "update":
            if (!action.prevTrade) return
            const idx = trades.findIndex((t) => t.id === action.trade.id)
            trades[idx] = action.prevTrade
            set({
              trades,
              undoStack: stack.slice(0, -1),
              redoStack: [...get().redoStack, action],
            })
            break
        }
      },
      redo: () => {
        const stack = get().redoStack
        if (!stack.length) return
        const action = stack[stack.length - 1]
        const trades = [...get().trades]

        switch (action.type) {
          case "add":
            set({
              trades: [...trades, action.trade],
              undoStack: [...get().undoStack, action],
              redoStack: stack.slice(0, -1),
            })
            break
          case "delete":
            set({
              trades: trades.filter((t) => t.id !== action.trade.id),
              undoStack: [...get().undoStack, action],
              redoStack: stack.slice(0, -1),
            })
            break
          case "update":
            const idx = trades.findIndex((t) => t.id === action.trade.id)
            trades[idx] = action.trade
            set({
              trades,
              undoStack: [...get().undoStack, action],
              redoStack: stack.slice(0, -1),
            })
            break
        }
      },
    }),
    { name: "trade-journal-storage" }
  )
)
