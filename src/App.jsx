import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useDarkMode }    from './hooks/useDarkMode'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import Cursor             from './components/Cursor'
import Nav                from './components/Nav'
import Home               from './pages/Home'
import Works              from './pages/Works'
import ProjectDetail      from './pages/ProjectDetail'

export default function App() {
  const { isDark, toggle } = useDarkMode()
  const location  = useLocation()
  const navigate  = useNavigate()
  const pageRef   = useRef(null)

  useSmoothScroll()

  // Expose navigate-with-fade to child components
  useEffect(() => {
    window.__nav = (path) => {
      if (!pageRef.current) { navigate(path); return }
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
      gsap.to(pageRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => navigate(path),
      })
    }
    return () => { delete window.__nav }
  }, [navigate])

  // Fade in on route change
  useEffect(() => {
    if (!pageRef.current) return
    window.__lenis?.resize()
    gsap.fromTo(
      pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    )
  }, [location.pathname])

  return (
    <div className="app">
      {/* Semi-transparent overlay */}
      <div className="bg-overlay" />

      {/* Custom cursor */}
      <Cursor />

      {/* Navigation + mode toggle */}
      <Nav isDark={isDark} onToggle={toggle} />

      {/* Pages */}
      <div ref={pageRef}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/works" element={<Works />} />
          <Route path="/works/:slug" element={<ProjectDetail />} />
        </Routes>
      </div>
    </div>
  )
}
