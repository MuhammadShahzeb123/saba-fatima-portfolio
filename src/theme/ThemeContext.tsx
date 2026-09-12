import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'saba-portfolio-theme'

export const THEME_COLORS = {
  light: {
    paper: '#f4f0e6',
    ink: '#1a1a1a',
    muted: '#5c5346',
    accent: '#0d9488',
    fog: '#f4f0e6',
    plaque: '#fffef8',
    brickPaper: '#e6dfd0',
    brickMortar: '#cfc7b6',
    brickFaceA: '#efe9dc',
    brickFaceB: '#ebe4d6',
    plank: '#dccfb8',
    plankA: '#ddd0b8',
    plankB: '#ebe2d0',
    wall: '#f5f1e8',
    woodSign: '#c4a574',
    woodSignText: '#1a1a1a',
    doorGlass: '#eef4f8',
    doorPane: '#dce8f0',
    poster: '#faf6ec',
    framePaper: '#fffef8',
    frameMuted: '#f2efe6',
    frameGray: '#ddd8cc',
    infoCard: '#faf7f0',
    wordmarkPlate: 'rgba(247, 243, 234, 0.55)',
    wordmarkInk: '#111',
    foliageFill: '#eef2e6',
    catFill: '#f7f3ea',
    cobble: '#e6e0d4',
    cobbleA: '#ebe6da',
    cobbleB: '#e0d9cb',
    projectDoor: '#eef3f7',
    projectDoorGlass: '#d8e4ee',
    scrollCueBg: '#fffef8',
    scrollCueInk: '#1a1a1a',
    posterBack: '#e8e2d6',
    wireframe: '#ddd',
    wireframeAlt: '#eee',
    wireframePaper: '#f5f0e6',
    signBoard: '#b8895a',
    doorFrame: '#4a3424',
    doorFrameDeep: '#3d2e22',
    doorFrameInner: '#5c4330',
    windowGlass: '#e8f0f5',
    windowShade: '#f5f0e8',
    cobbleEdge: '#cfc6b6',
    cuePlate: '#fffef8',
    doorHot: '#2a2a2a',
    doorIdle: '#3a2f26',
    doorTintHot: '#ffffff',
    doorTintIdle: '#f2f2f2',
    pier: '#d4c4a8',
    avatarBack: '#f0ebe3',
    tape: '#7dd3fc',
    accentDoor: '#38bdf8',
    characterFill: '#f7f3ea',
  },
  dark: {
    paper: '#141820',
    ink: '#e8e4dc',
    muted: '#9a958c',
    accent: '#5b9a8b',
    fog: '#141820',
    plaque: '#1a1f28',
    brickPaper: '#1c2129',
    brickMortar: '#151920',
    brickFaceA: '#232933',
    brickFaceB: '#1e242e',
    plank: '#1a1f27',
    plankA: '#1c222b',
    plankB: '#222830',
    wall: '#181c24',
    woodSign: '#3d3428',
    woodSignText: '#e8e4dc',
    doorGlass: '#1e2832',
    doorPane: '#243040',
    poster: '#1c2129',
    framePaper: '#1a1f28',
    frameMuted: '#181c24',
    frameGray: '#2a303a',
    infoCard: '#1a1f28',
    wordmarkPlate: 'rgba(20, 24, 32, 0.65)',
    wordmarkInk: '#e8e4dc',
    foliageFill: '#1e2820',
    catFill: '#1c2129',
    cobble: '#1a1e26',
    cobbleA: '#222830',
    cobbleB: '#1c2129',
    projectDoor: '#1e2832',
    projectDoorGlass: '#243040',
    scrollCueBg: '#1a1f28',
    scrollCueInk: '#e8e4dc',
    posterBack: '#1c2129',
    wireframe: '#c8c4bc',
    wireframeAlt: '#a8a49c',
    wireframePaper: '#c8c4bc',
    signBoard: '#3d3428',
    doorFrame: '#2a2218',
    doorFrameDeep: '#1e1812',
    doorFrameInner: '#32281e',
    windowGlass: '#243040',
    windowShade: '#2a3545',
    cobbleEdge: '#151920',
    cuePlate: '#1a1f28',
    doorHot: '#3a5048',
    doorIdle: '#252018',
    doorTintHot: '#c8e0d8',
    doorTintIdle: '#b0b0a8',
    pier: '#1c222b',
    avatarBack: '#1c2129',
    tape: '#3d6b7a',
    accentDoor: '#5b9a8b',
    characterFill: '#1c2129',
  },
} as const

export type ThemePalette = (typeof THEME_COLORS)[Theme]

type ThemeContextValue = {
  theme: Theme
  colors: ThemePalette
  setTheme: (t: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'dark'
}

function applyDomTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = readStoredTheme()
    applyDomTheme(t)
    return t
  })

  useEffect(() => {
    applyDomTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    [],
  )

  const value = useMemo(
    () => ({
      theme,
      colors: THEME_COLORS[theme],
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
