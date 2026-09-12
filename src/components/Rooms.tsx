import { useMemo, useState } from 'react'
import { Html } from '@react-three/drei'
import { portfolio } from '../data/content'
import { infoCardTexture, woodSignTexture, cached } from '../utils/textures'
import { useTheme } from '../theme/ThemeContext'

export function AboutRoom() {
  const { about, education, profile } = portfolio
  const lines = useMemo(
    () => [
      '#ABOUT',
      `*${about.headline}`,
      '',
      about.summary,
      '',
      '#What I Do',
      ...about.what_i_do.map((w) => `• ${w}`),
      '',
      '#Education',
      ...education.map((e) => `${e.degree} — ${e.institution} (${e.years})`),
    ],
    [about, education],
  )
  const { theme, colors } = useTheme()
  const tex = useMemo(() => cached(`about-card@${theme}`, () => infoCardTexture(lines, 640, 800, '#4F46E5', theme)), [lines, theme])
  const avatar = useMemo(() => {
    // simple sketched avatar placeholder plane using photo
    return null
  }, [])

  return (
    <group position={[2.4, 1.6, -58]}>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 3.35]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      {/* Avatar on opposite alcove */}
      <mesh position={[-4.8, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial color={colors.avatarBack} />
      </mesh>
      <Html position={[-4.8, 0.2, 0]} transform rotation={[0, Math.PI / 2, 0]} distanceFactor={4}>
        <img
          src={`${import.meta.env.BASE_URL}avatar.jpg`}
          alt={profile.name}
          style={{
            width: 120,
            height: 120,
            objectFit: 'cover',
            borderRadius: 8,
            border: '3px solid var(--ink)',
            filter: 'grayscale(0.3) contrast(1.05)',
          }}
        />
      </Html>
      {avatar}
    </group>
  )
}

export function ExperienceRoom() {
  const lines = useMemo(() => {
    const out = ['#EXPERIENCE', '']
    for (const job of portfolio.experience) {
      out.push(`*${job.title}`)
      out.push(`${job.organization}${job.duration ? ` · ${job.duration}` : ''}`)
      for (const h of job.highlights.slice(0, 2)) out.push(`• ${h}`)
      out.push('')
    }
    return out
  }, [])
  const { theme } = useTheme()
  const tex = useMemo(() => cached(`exp-card@${theme}`, () => infoCardTexture(lines, 640, 820, '#0891B2', theme)), [lines, theme])
  return (
    <group position={[-2.4, 1.6, -68]}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 3.45]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  )
}

export function SkillsRoom() {
  const skills = portfolio.skills.all
  const lines = useMemo(() => {
    const out = ['#SKILLS', '', '*Stack & tools', '']
    // chunk into lines
    for (let i = 0; i < skills.length; i += 3) {
      out.push(skills.slice(i, i + 3).map((s) => `▸ ${s}`).join('   '))
    }
    return out
  }, [skills])
  const { theme } = useTheme()
  const tex = useMemo(() => cached(`skills-card@${theme}`, () => infoCardTexture(lines, 640, 760, '#059669', theme)), [lines, theme])
  return (
    <group position={[2.4, 1.6, -78]}>
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 3.15]} />
        <meshBasicMaterial map={tex} />
      </mesh>
      {/* floating skill badges */}
      {skills.slice(0, 8).map((s, i) => (
        <SkillBadge key={s} label={s} index={i} />
      ))}
    </group>
  )
}

function SkillBadge({ label, index }: { label: string; index: number }) {
  const { theme } = useTheme()
  const tex = useMemo(() => cached(`skill-${label}@${theme}`, () => woodSignTexture(label, 320, 110, theme)), [label, theme])
  const angle = (index / 8) * Math.PI * 2
  const x = Math.cos(angle) * 0.9
  const y = Math.sin(angle) * 0.7
  return (
    <mesh position={[-0.2 + x * 0.3, y, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
      <planeGeometry args={[0.85, 0.34]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  )
}

export function ContactRoom() {
  const { contact, profile } = portfolio
  const [hovered, setHovered] = useState<string | null>(null)
  const { colors } = useTheme()
  const links = [
    { id: 'github', label: 'GITHUB', url: contact.github },
    { id: 'linkedin', label: 'LINKEDIN', url: contact.linkedin },
    { id: 'email', label: 'EMAIL', url: `mailto:${contact.email}` },
    { id: 'phone', label: 'PHONE', url: `tel:${contact.phone.replace(/\s/g, '')}` },
    { id: 'web', label: 'PORTFOLIO', url: contact.portfolio },
  ]

  return (
    <group position={[0, 0, -90]}>
      {/* Pier floor extension */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -2]}>
        <planeGeometry args={[4, 8]} />
        <meshBasicMaterial color={colors.pier} />
      </mesh>

      {/* End wall message */}
      <Html position={[0, 2.6, -1]} center distanceFactor={8}>
        <div className="contact-banner">
          <h2>Let&apos;s connect</h2>
          <p>{profile.name} · {contact.location}</p>
          <p>{contact.email} · {contact.phone}</p>
        </div>
      </Html>

      {links.map((link, i) => {
        const x = (i - 2) * 0.95
        return (
          <group key={link.id} position={[x, 0.9, -3.2]}>
            <mesh
              onPointerOver={() => {
                setHovered(link.id)
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                setHovered(null)
                document.body.style.cursor = 'auto'
              }}
              onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
            >
              <boxGeometry args={[0.75, 0.9, 0.12]} />
              <meshBasicMaterial color={hovered === link.id ? colors.accent : colors.signBoard} />
            </mesh>
            <Html position={[0, 0, 0.1]} center distanceFactor={6}>
              <div className={`contact-sign ${hovered === link.id ? 'hot' : ''}`}>{link.label}</div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
