import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type GateContextValue = {
  gateOpen: boolean
  entered: boolean
  openGate: () => void
  markEntered: () => void
}

const GateContext = createContext<GateContextValue | null>(null)

export function GateProvider({ children }: { children: ReactNode }) {
  const [gateOpen, setGateOpen] = useState(false)
  const [entered, setEntered] = useState(false)

  const openGate = useCallback(() => setGateOpen(true), [])
  const markEntered = useCallback(() => setEntered(true), [])

  const value = useMemo(
    () => ({ gateOpen, entered, openGate, markEntered }),
    [gateOpen, entered, openGate, markEntered],
  )

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>
}

export function useGate() {
  const ctx = useContext(GateContext)
  if (!ctx) throw new Error('useGate must be used within GateProvider')
  return ctx
}
