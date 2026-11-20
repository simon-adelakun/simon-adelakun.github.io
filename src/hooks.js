import { useEffect, useRef, useState } from 'react'

// Monte la scène 3D seulement quand elle approche de l'écran, la met en pause quand elle sort.
export function useInView(margin = '250px') {
  const ref = useRef(null)
  const [inView, setIn] = useState(false)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { setIn(e.isIntersecting); if (e.isIntersecting) setSeen(true) }, { rootMargin: margin })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [margin])
  return [ref, inView, seen]
}

// Limite la résolution du rendu 3D sur mobile (plus fluide, moins de batterie)
export const DPR = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches ? [1, 1.5] : [1, 2]
