import { useMemo, useState, useCallback, useEffect } from 'react'
import { galleryProjects, portfolio, TAGLINE } from '../data/content'
import { SECTIONS, bannerForProgress } from '../data/sections'
import { getScrollMax } from '../hooks/useScrollProgress'
import { useIsMobile } from '../hooks/useIsMobile'
import { useTheme } from '../theme/ThemeContext'
import { useGate } from '../context/GateContext'

export function HUD({ progress }: { progress: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [fade, setFade] = useState(0)
  const [jumping, setJumping] = useState(false)
  const mobile = useIsMobile()
  const { theme, toggleTheme } = useTheme()
  const { gateOpen, openGate } = useGate()

  const banner = useMemo(() => {
    const b = bannerForProgress(progress)
    let text = ''
    switch (b.textKey) {
      case 'enter':
        text = gateOpen
          ? mobile
            ? 'Scroll or use ▲▼ · Tap doors for GitHub'
            : 'Scroll to enter · Tap project doors for GitHub'
          : mobile
            ? 'Tap “Open gate” or scroll slightly to enter'
            : 'Open the gate · or scroll to swing the doors'
        break
      case 'hub':
        text = 'Scroll to explore the corridor'
        break
      case 'gallery':
        text = `Near a door · ${galleryProjects.length} projects`
        break
      case 'about':
        text = portfolio.about.headline
        break
      case 'experience':
        text = 'Roles & internships'
        break
      case 'skills':
        text = 'Flutter · CV · AI/ML · Python'
        break
      case 'contact':
        text = portfolio.contact.email
        break
      default:
        text = ''
    }
    return { title: b.title, text }
  }, [progress, mobile, gateOpen])

  const jump = useCallback(
    (at: number) => {
      if (jumping) return
      setMenuOpen(false)
      setJumping(true)
      setFade(1)
      window.setTimeout(() => {
        const max = getScrollMax()
        window.scrollTo({ top: at * max, behavior: 'auto' })
        window.setTimeout(() => {
          setFade(0)
          setJumping(false)
        }, 80)
      }, 280)
    },
    [jumping],
  )

  const openAndEnter = useCallback(() => {
    openGate()
    jump(0.14)
  }, [openGate, jump])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const showEnter = progress < 0.08

  return (
    <div className={`hud ${mobile ? 'hud-mobile' : ''}`}>
      <div className={`hud-fade ${fade > 0 ? 'on' : ''}`} aria-hidden style={{ opacity: fade }} />

      <div className="hud-top">
        <div className="hud-brand ink-plaque">
          <span className="hud-name">Saba Fatima</span>
          {!mobile && <span className="hud-tag">{TAGLINE}</span>}
        </div>
        <div className="hud-icons">
          <button
            type="button"
            className="paper-btn ink-btn theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            type="button"
            className="paper-btn ink-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
          {!mobile && (
            <button
              type="button"
              className="paper-btn ink-btn"
              aria-label="Sound"
              onClick={() => setSoundOn((v) => !v)}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
          )}
          <a
            className="paper-btn ink-btn"
            href={portfolio.contact.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            ★
          </a>
        </div>
      </div>

      {menuOpen && (
        <nav className="hud-menu paper-panel ink-plaque">
          {SECTIONS.map((s) => (
            <button key={s.id} type="button" onClick={() => jump(s.at)}>
              {s.label}
            </button>
          ))}
          <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${portfolio.contact.email}`}>Email</a>
        </nav>
      )}

      {showEnter && (
        <button
          type="button"
          className="enter-corridor-btn"
          onClick={() => {
            if (!gateOpen) openAndEnter()
            else jump(0.14)
          }}
        >
          {gateOpen ? 'Enter corridor · Scroll ↓' : 'Open gate / Enter'}
        </button>
      )}

      <div className="hud-banner torn-banner">
        <div className="banner-check">▦</div>
        <div className="banner-copy">
          <div className="banner-title">{banner.title}</div>
          <div className="banner-text">{banner.text}</div>
        </div>
      </div>

      <div className="hud-progress">
        <div className="hud-progress-bar" style={{ width: `${Math.min(100, progress * 100)}%` }} />
      </div>
    </div>
  )
}
