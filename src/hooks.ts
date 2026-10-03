import { useEffect, useRef, useState } from 'react'

export const formatRupiah = (n: number): string =>
  new Intl.NumberFormat('id-ID').format(n)

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** true setelah elemen pertama kali masuk layar (untuk animasi muncul saat scroll) */
export function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, inView }
}

/** angka yang berganti halus dari nilai lama ke nilai baru */
export function useTween(target: number, duration = 450): number {
  const [shown, setShown] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    const from = current.current
    if (from === target) return
    if (prefersReducedMotion()) {
      current.current = target
      setShown(target)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const value = Math.round(from + (target - from) * eased)
      current.current = value
      setShown(value)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return shown
}
