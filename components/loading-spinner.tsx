"use client"

import { Spinner } from "@/components/ui/spinner"

export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  )
}
