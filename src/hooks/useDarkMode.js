import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    return (localStorage.getItem('rdg-mode') || 'dark') === 'dark'
  })

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('dark', 'light')
    html.classList.add(isDark ? 'dark' : 'light')
    localStorage.setItem('rdg-mode', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark((d) => !d)

  return { isDark, toggle }
}
