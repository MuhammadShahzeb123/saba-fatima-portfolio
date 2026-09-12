import { portfolio } from '../data/content'
import { usePanel } from '../context/PanelContext'

export function InfoPanel() {
  const { panel, closePanel } = usePanel()
  if (!panel) return null

  return (
    <div className="info-panel-backdrop" onClick={closePanel} role="presentation">
      <div
        className="info-panel ink-plaque"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="info-panel-close" onClick={closePanel} aria-label="Close">
          ×
        </button>

        {panel.kind === 'project' && (
          <>
            <h2>{panel.project.title}</h2>
            <p className="info-panel-meta">
              {panel.project.language || 'Project'}
              {panel.project.stars > 0 ? ` · ★ ${panel.project.stars}` : ''}
            </p>
            <p>{panel.project.description}</p>
            {panel.project.tech.length > 0 && (
              <p className="info-panel-tags">{panel.project.tech.slice(0, 6).join(' · ')}</p>
            )}
            <a
              className="info-panel-cta"
              href={panel.project.url}
              target="_blank"
              rel="noreferrer"
            >
              Open GitHub ↗
            </a>
          </>
        )}

        {panel.kind === 'about' && (
          <>
            <h2>About</h2>
            <p className="info-panel-meta">{portfolio.about.headline}</p>
            <p>{portfolio.about.summary}</p>
            <ul className="info-panel-list">
              {portfolio.about.what_i_do.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}

        {panel.kind === 'contact' && (
          <>
            <h2>Contact</h2>
            <p>{portfolio.contact.location}</p>
            <a className="info-panel-cta" href={`mailto:${portfolio.contact.email}`}>
              {portfolio.contact.email}
            </a>
            <div className="info-panel-links">
              <a href={portfolio.contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
