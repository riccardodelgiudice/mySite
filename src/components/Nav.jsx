import { useLocation } from 'react-router-dom'
import '../styles/nav.css'

const SOCIAL = [
  { href: 'https://www.linkedin.com/in/riccardo-del-giudice-029b28332/', icon: 'fa-brands fa-linkedin', label: 'LinkedIn' },
  { href: 'https://github.com/riccardodelgiudice',                        icon: 'fa-brands fa-github',   label: 'GitHub'   },
  { href: 'mailto:hello.riccardodelgiudice@gmail.com',                    icon: 'fa-regular fa-envelope', label: 'Email'   },
]

function SocialLinks() {
  return (
    <div className="social">
      {SOCIAL.map(({ href, icon, label }) => (
        <a key={label} href={href} aria-label={label} data-cursor="nav"
           target={href.startsWith('http') ? '_blank' : undefined}
           rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
          <i className={icon} />
        </a>
      ))}
    </div>
  )
}

function NavItems() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isWorks = location.pathname.startsWith('/works')

  const handleNav = (path) => {
    if (location.pathname === path) return
    if (window.__nav) window.__nav(path)
  }

  return (
    <>
      <button
        className={`nav-item${isHome ? ' active' : ''}`}
        data-cursor="nav"
        onClick={() => handleNav('/')}
      >HOME</button>
      <button
        className={`nav-item${isWorks ? ' active' : ''}`}
        data-cursor="nav"
        onClick={() => handleNav('/works')}
      >WORKS</button>
    </>
  )
}

export default function Nav({ isDark, onToggle }) {
  return (
    <>
      {/* Mobile bar */}
      <nav className="nav-mobile" id="nav-mobile">
        <div className="nav-links"><NavItems /></div>
        <SocialLinks />
      </nav>

      {/* Desktop left */}
      <nav className="nav-desktop" id="nav-desktop">
        <NavItems />
        <SocialLinks />
      </nav>

      {/* Dark/Light toggle */}
      <div className="toggle-wrap">
        <button
          className="toggle-btn"
          onClick={onToggle}
          aria-label="Toggle theme"
          data-cursor="nav"
        >
          <div className={`toggle-dot${!isDark ? ' on' : ''}`} />
          <div className={`toggle-dot${isDark  ? ' on' : ''}`} />
        </button>
      </div>
    </>
  )
}
