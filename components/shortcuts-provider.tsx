"use client"

import type React from "react"

import { createContext, useContext, useState, useCallback } from "react"
import type { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts"
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal"

interface ShortcutsContextType {
  registerShortcuts: (shortcuts: KeyboardShortcut[]) => void
  openShortcutsModal: () => void
}

const ShortcutsContext = createContext<ShortcutsContextType | undefined>(undefined)

export function ShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const registerShortcuts = useCallback((newShortcuts: KeyboardShortcut[]) => {
    setShortcuts((prev) => {
      // Remover duplicados basado en la combinación de teclas
      const filtered = prev.filter(
        (p) =>
          !newShortcuts.some(
            (n) =>
              n.key === p.key &&
              n.ctrlKey === p.ctrlKey &&
              n.shiftKey === p.shiftKey &&
              n.altKey === p.altKey &&
              n.metaKey === p.metaKey,
          ),
      )
      return [...filtered, ...newShortcuts]
    })
  }, [])

  return (
    <ShortcutsContext.Provider
      value={{
        registerShortcuts,
        openShortcutsModal: () => setIsModalOpen(true),
      }}
    >
      {children}
      <KeyboardShortcutsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} shortcuts={shortcuts} />
    </ShortcutsContext.Provider>
  )
}

export function useShortcuts() {
  const context = useContext(ShortcutsContext)
  if (!context) {
    throw new Error("useShortcuts debe usarse dentro de ShortcutsProvider")
  }
  return context
}
