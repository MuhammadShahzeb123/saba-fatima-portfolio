import { useEffect, useState } from 'react'

/** True when viewport matches phone / narrow tablet. */
export function useIsMobile(query = '(max-width: 768px)') {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMobile(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return mobile
}

export function getIsMobile() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
}
