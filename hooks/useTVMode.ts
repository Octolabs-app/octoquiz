'use client'
import { createContext, useContext, useState } from 'react'

interface TVModeContextType {
  tvMode: boolean
  toggleTVMode: () => void
}

export const TVModeContext = createContext<TVModeContextType>({
  tvMode: false,
  toggleTVMode: () => {},
})

export function useTVMode() {
  return useContext(TVModeContext)
}

export function useTVModeState() {
  const [tvMode, setTVMode] = useState(false)
  return { tvMode, toggleTVMode: () => setTVMode(v => !v) }
}
