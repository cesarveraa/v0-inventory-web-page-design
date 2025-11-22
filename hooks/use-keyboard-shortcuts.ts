"use client"

import { useEffect, useCallback } from "react"

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  description: string
  action: () => void
  category: "navegación" | "acciones" | "otro"
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignorar si estamos escribiendo en un input
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        // Permitir ciertos atajos incluso en inputs
        const allowedInInput = shortcuts.filter((s) => s.key === "?")
        if (!allowedInInput.some((s) => matchesShortcut(event, s))) {
          return
        }
      }

      for (const shortcut of shortcuts) {
        if (matchesShortcut(event, shortcut)) {
          event.preventDefault()
          shortcut.action()
          break
        }
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

function matchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
  return (
    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
    event.ctrlKey === (shortcut.ctrlKey ?? false) &&
    event.shiftKey === (shortcut.shiftKey ?? false) &&
    event.altKey === (shortcut.altKey ?? false) &&
    event.metaKey === (shortcut.metaKey ?? false)
  )
}
