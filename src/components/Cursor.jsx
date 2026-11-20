import { useEffect, useRef } from 'react'
// Pastille lilas lumineuse qui suit la souris, comme sur moncy.dev
export default function Cursor() {
  const el = useRef()
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    let x = 0, y = 0, cx = 0, cy = 0, raf
    const mv = (e) => { x = e.clientX; y = e.clientY }
    const loop = () => { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; if (el.current) el.current.style.transform = `translate(${cx - 14}px,${cy - 14}px)`; raf = requestAnimationFrame(loop) }
    addEventListener('mousemove', mv); loop()
    return () => { removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])
  return <div className="cursor" ref={el} />
}
