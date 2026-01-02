import { create } from "zustand"

type UIState = {
  tradeModalOpen: boolean
  openTradeModal: () => void
  closeTradeModal: () => void
}

export const useUIStore = create<UIState>(set => ({
  tradeModalOpen: false,
  openTradeModal: () => set({ tradeModalOpen: true }),
  closeTradeModal: () => set({ tradeModalOpen: false }),
}))
