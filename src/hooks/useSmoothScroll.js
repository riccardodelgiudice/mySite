import { useEffect } from 'react'
import Lenis from 'lenis'

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.34,
      easing: (t) => 1 - Math.pow(1 - t, 3.6),
      smoothWheel: true,
      syncTouch: false,
      gestureOrientation: 'vertical',
      wheelMultiplier: 0.96,
      touchMultiplier: 1.1,
      autoResize: true,
      autoRaf: true,
    })

    window.__lenis = lenis

    return () => {
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
}
