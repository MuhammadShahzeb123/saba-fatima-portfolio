import { useMemo, useState, useCallback, useEffect } from 'react'
import { galleryProjects, portfolio, TAGLINE } from '../data/content'
import { SECTIONS, bannerForProgress } from '../data/sections'

export function HUD({ progress }: { progress: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [fade, setFade] = useState(0)
  const [jumping, setJumping] = useState(false)

  const banner = useMemo(() => {
    const b = bannerForProgress(progress)
    let text = ''
    switch (b.textKey) {
      case 'enter':
        text = 'Scroll or click to enter the corridor'
        break
      case 'hub':
        text = 'Scroll to explore the corridor'
        break
      case 'gallery':
        text = `Hover frames · ${galleryProjects.length} projects on the walls`
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
  }, [progress])

  const jump = useCallback((at: number) => {
    if (jumping) return
    setMenuOpen(false)
    setJumping(true)
    // Fade to paper/ink overlay, teleport scroll, fade back — no cream flash
    setFade(1)
    window.setTimeout(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      window.scrollTo({ top: at * max, behavior: 'auto' })
      window.setTimeout(() => {
        setFade(0)
        setJumping(false)
      }, 80)
    }, 280)
  }, [jumping])

  // Allow Escape to close menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="hud">
      <div
        className={`hud-fade ${fade > 0 ? 'on' : ''}`}
        aria-hidden
        style={{ opacity: fade }}
      />

      <div className="hud-top">
        <div className="hud-brand ink-plaque">
          <span className="hud-name">Saba Fatima</span>
          <span className="hud-tag">{TAGLINE}</span>
        </div>
        <div className="hud-icons">
          <button
            type="button"
            className="paper-btn ink-btn"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            ☰
          </button>
          <button
            type="button"
            className="paper-btn ink-btn"
            aria-label="Sound"
            onClick={() => setSoundOn((v) => !v)}
          >
            {soundOn ? '🔊' : '🔇'}
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

      <div className="hud-banner torn-banner">
        <div className="banner-check">▦</div>
        <div>
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
