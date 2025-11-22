"use client"

import { useEffect, useState } from "react"
import { X, Keyboard } from "lucide-react"
import type { KeyboardShortcut } from "@/hooks/use-keyboard-shortcuts"

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
  shortcuts: KeyboardShortcut[]
}

export function KeyboardShortcutsModal({ isOpen, onClose, shortcuts }: KeyboardShortcutsModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const categories = {
    navegación: shortcuts.filter((s) => s.category === "navegación"),
    acciones: shortcuts.filter((s) => s.category === "acciones"),
    otro: shortcuts.filter((s) => s.category === "otro"),
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Atajos de Teclado</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {Object.entries(categories).map(
              ([category, items]) =>
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">{category}</h3>
                    <div className="space-y-2">
                      {items.map((shortcut, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                          <span className="text-sm text-foreground">{shortcut.description}</span>
                          <kbd className="px-3 py-1 bg-muted text-muted-foreground rounded text-xs font-mono border border-border">
                            {formatShortcut(shortcut)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function formatShortcut(shortcut: KeyboardShortcut): string {
  const parts = []
  if (shortcut.ctrlKey) parts.push("Ctrl")
  if (shortcut.shiftKey) parts.push("Shift")
  if (shortcut.altKey) parts.push("Alt")
  if (shortcut.metaKey) parts.push("Cmd")
  parts.push(shortcut.key.toUpperCase())
  return parts.join(" + ")
}
