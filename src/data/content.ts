import raw from './portfolio.json'

export type Project = {
  name: string
  description: string | null
  language: string | null
  stars: number
  html_url: string
  is_stub: boolean
  has_readme: boolean
  summary: string | null
  tech_stack: string[] | null
  notable_features: string[] | null
}

export type PortfolioData = {
  profile: {
    login: string
    name: string
    bio: string
    company: string
    location: string
    blog: string
    avatar_url: string
    html_url: string
  }
  contact: {
    email: string
    phone: string
    location: string
    linkedin: string
    github: string
    portfolio: string
  }
  about: {
    headline: string
    summary: string
    what_i_do: string[]
    github_bio: string
  }
  education: Array<{ institution: string; degree: string; years: string }>
  experience: Array<{
    title: string
    organization: string
    duration: string | null
    highlights: string[]
  }>
  skills: {
    from_portfolio: string[]
    from_github_bio_and_projects: string[]
    all: string[]
  }
  projects: Project[]
}

const data = raw as PortfolioData

const SKIP = new Set([
  'Sabafatima9',
  'testing_github',
  'saba-portfolio',
  'Practice_Advanced_python_with_jupyterNotebook',
  'Practice_python_with_jupyterNotebook',
])

function prettyTitle(name: string): string {
  return name
    .replace(/-Week\d+Tech4Edges-?/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export type GalleryProject = {
  id: string
  name: string
  title: string
  description: string
  url: string
  language: string | null
  stars: number
  tech: string[]
  color: string
}

const PALETTE = [
  '#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626',
  '#7C3AED', '#2563EB', '#DB2777', '#0D9488', '#CA8A04',
]

export const portfolio = data

export const galleryProjects: GalleryProject[] = data.projects
  .filter((p) => {
    if (SKIP.has(p.name)) return false
    if (p.is_stub && !(p.description || p.summary)) return false
    return true
  })
  .map((p, i) => ({
    id: p.name,
    name: p.name,
    title: prettyTitle(p.name),
    description: (p.summary || p.description || 'Open-source project on GitHub.').slice(0, 220),
    url: p.html_url,
    language: p.language,
    stars: p.stars,
    tech: p.tech_stack || (p.language ? [p.language] : []),
    color: PALETTE[i % PALETTE.length],
  }))

export const TAGLINE = '< AI · CV · Flutter />'
export const NAME = data.profile.name

