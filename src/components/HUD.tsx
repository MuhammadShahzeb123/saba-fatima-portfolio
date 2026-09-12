import { useEffect, useState } from 'react'
import { galleryProjects, portfolio, TAGLINE } from '../data/content'
import { useIsMobile } from '../hooks/useIsMobile'
import { useTheme } from '../theme/ThemeContext'
import { useGate } from '../context/GateContext'
import { usePanel } from '../context/PanelContext'

export function HUD() {
  const [menuOpen, setMenuOpen] = useState(false)
  const mobile = useIsMobile()
  const { theme, toggleTheme } = useTheme()
  const { gateOpen, entered, openGate } = useGate()
  const { openAbout, openContact } = usePanel()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={`hud ${mobile ? 'hud-mobile' : ''}`}>
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
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              openAbout()
            }}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              openContact()
            }}
          >
            Contact
          </button>
          <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${portfolio.contact.email}`}>Email</a>
          <a href={portfolio.contact.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </nav>
      )}

      {!gateOpen && (
        <button type="button" className="enter-corridor-btn enter-gate-btn" onClick={openGate}>
          Open gate / Enter
        </button>
      )}

      <div className="hud-banner torn-banner">
        <div className="banner-check">▦</div>
        <div className="banner-copy">
          <div className="banner-title">
            {!gateOpen ? 'Outside' : !entered ? 'Entering…' : 'Gallery'}
          </div>
          <div className="banner-text">
            {!gateOpen
              ? 'Tap Open gate to step inside'
              : !entered
                ? 'Doors swinging open…'
                : mobile
                  ? `Drag to look · Tap a door · ${galleryProjects.length} projects`
                  : `Drag to look around · Click a door · ${galleryProjects.length} projects`}
          </div>
        </div>
      </div>
    </div>
  )
}
