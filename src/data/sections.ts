/**
 * Shared scroll progress ↔ corridor section map.
 * Camera z ≈ lerp(10, -95, progress)  →  progress ≈ (10 - z) / 105
 */
export const SECTIONS = [
  { id: 'enter', label: 'Entrance', at: 0, banner: { title: 'EXPLORER', text: 'Tap a project door · Scroll to enter' } },
  { id: 'hub', label: 'Hub', at: 0.14, banner: { title: 'WANDERER', text: 'Scroll to explore the corridor' } },
  { id: 'gallery', label: 'Gallery', at: 0.28, banner: { title: 'GALLERY', text: 'Hover frames · projects on the walls' } },
  { id: 'about', label: 'About', at: 0.64, banner: { title: 'ABOUT', text: '' } },
  { id: 'experience', label: 'Experience', at: 0.74, banner: { title: 'EXPERIENCE', text: 'Roles & internships' } },
  { id: 'skills', label: 'Skills', at: 0.84, banner: { title: 'SKILLS', text: 'Flutter · CV · AI/ML · Python' } },
  { id: 'contact', label: 'Contact', at: 0.94, banner: { title: 'CONTACT', text: '' } },
] as const

/** Banner thresholds aligned to camera z of each room. */
export function bannerForProgress(progress: number): { title: string; textKey: string } {
  if (progress < 0.08) return { title: 'EXPLORER', textKey: 'enter' }
  if (progress < 0.22) return { title: 'WANDERER', textKey: 'hub' }
  // Gallery ends ~z=-55 → p≈0.62
  if (progress < 0.62) return { title: 'GALLERY', textKey: 'gallery' }
  // About z≈-58 → p≈0.65; handoff before Experience z=-68 (p≈0.74)
  if (progress < 0.71) return { title: 'ABOUT', textKey: 'about' }
  if (progress < 0.80) return { title: 'EXPERIENCE', textKey: 'experience' }
  if (progress < 0.90) return { title: 'SKILLS', textKey: 'skills' }
  return { title: 'CONTACT', textKey: 'contact' }
}
