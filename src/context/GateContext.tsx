import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type GateContextValue = {
  gateOpen: boolean
  openGate: () => void
  setGateOpen: (v: boolean) => void
}

const GateContext = createContext<GateContextValue | null>(null)

export function GateProvider({
  children,
  progress,
}: {
  children: ReactNode
  progress: number
}) {
  const [gateOpen, setGateOpen] = useState(false)

  const openGate = useCallback(() => setGateOpen(true), [])

  // Auto-open when scroll crosses a small threshold
  useEffect(() => {
    if (!gateOpen && progress >= 0.03) {
      setGateOpen(true)
    }
  }, [progress, gateOpen])

  const value = useMemo(
    () => ({ gateOpen, openGate, setGateOpen }),
    [gateOpen, openGate],
  )

  return <GateContext.Provider value={value}>{children}</GateContext.Provider>
}

export function useGate() {
  const ctx = useContext(GateContext)
  if (!ctx) throw new Error('useGate must be used within GateProvider')
  return ctx
}
