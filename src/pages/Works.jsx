import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import ArrowIcon from '../components/ArrowIcon'
import { PROJECTS } from '../data/projects'
import '../styles/works.css'

const total = PROJECTS.length

export default function Works() {
  const navigate = useNavigate()
  const [activeIdx, setActiveIdx] = useState(0)
  const infoRef = useRef(null)
  const cardRefs = useRef([])
  const activeRef = useRef(0)
  const fadingRef = useRef(false)

  const project = PROJECTS[activeIdx]
  const counter = `[ ${String(activeIdx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} ]`

  const openPath = useCallback((path) => {
    if (window.__nav) {
      window.__nav(path)
      return
    }

    navigate(path)
  }, [navigate])

  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (!infoRef.current) return

    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: 0.24, clearProps: 'transform' }
    )
  }, [])

  useEffect(() => {
    if (!infoRef.current) return

    gsap.fromTo(
      infoRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', clearProps: 'transform' }
    )
  }, [activeIdx])

  const revealProject = useCallback((nextIdx) => {
    if (nextIdx === activeRef.current) return
    if (!infoRef.current || fadingRef.current) return

    fadingRef.current = true
    gsap.to(infoRef.current, {
      opacity: 0,
      y: 12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        activeRef.current = nextIdx
        setActiveIdx(nextIdx)
        fadingRef.current = false
      },
    })
  }, [])

  const bringInfoIntoView = useCallback(() => {
    if (window.matchMedia('(min-width: 1024px)').matches) return
    if (!infoRef.current) return

    window.requestAnimationFrame(() => {
      if (window.__lenis) {
        window.__lenis.scrollTo(infoRef.current, {
          offset: -24,
          duration: 0.75,
        })
        return
      }

      infoRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [])

  const focusCard = useCallback((idx) => {
    const card = cardRefs.current[idx]
    if (!card) return

    if (window.matchMedia('(min-width: 1024px)').matches) {
      if (window.__lenis) {
        window.__lenis.scrollTo(card, {
          offset: -window.innerHeight * 0.2,
          duration: 0.75,
        })
      } else {
        card.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        })
      }
      return
    }

    card.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [])

  const activateProject = useCallback((idx, options = {}) => {
    const { focusImage = false, showInfo = false } = options

    if (focusImage) {
      focusCard(idx)
    }

    revealProject(idx)

    if (showInfo) {
      bringInfoIntoView()
    }
  }, [bringInfoIntoView, focusCard, revealProject])

  useEffect(() => {
    const observers = cardRefs.current
      .map((card, idx) => {
        if (!card) return null

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting || fadingRef.current) return
            if (idx === activeRef.current) return
            revealProject(idx)
          },
          { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
        )

        observer.observe(card)
        return observer
      })
      .filter(Boolean)

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [revealProject])

  const go = useCallback((dir) => {
    if (fadingRef.current) return
    const next = (activeRef.current + dir + total) % total
    activateProject(next, { focusImage: true, showInfo: true })
  }, [activateProject])

  const renderMetaLink = (item) => {
    if (!item.link) return null

    if (item.link.startsWith('http')) {
      return (
        <a
          className="works-link"
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className={item.linkIcon} />
          {item.linkLabel}
        </a>
      )
    }

    return (
      <button
        type="button"
        className="works-link works-link-button"
        onClick={() => openPath(item.link)}
      >
        <i className={item.linkIcon} />
        {item.linkLabel}
      </button>
    )
  }

  return (
    <>
      <div className="works-page">
        <div className="works-imgs-col">
          {PROJECTS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={`works-img-card${activeIdx === index ? ' is-active' : ''}`}
              data-cursor="view"
              data-cursor-label="VIEW"
              aria-label={`Open project page for ${item.title}`}
              aria-pressed={activeIdx === index}
              onMouseEnter={() => activateProject(index)}
              onFocus={() => activateProject(index)}
              onClick={() => openPath(item.route)}
              ref={(element) => {
                cardRefs.current[index] = element
              }}
            >
              <div className="works-img-bg" style={{ background: item.bg }} />
              {item.image ? (
                <>
                  <img
                    className="works-img-media"
                    src={item.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="works-img-overlay" />
                </>
              ) : (
                <div className="works-img-mock">
                  <span className="works-img-acronym">
                    {item.title.split(' ').map((word) => word[0]).join('')}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="works-info" ref={infoRef} style={{ opacity: 0 }}>
          <div className="works-header">
            <span className="works-title-label">WORKS</span>
            <span className="works-handle">/riccardodelgiudice</span>
          </div>
          <div className="works-divider" />

          <div className="works-info-content">
            <div className="works-counter">{counter}</div>
            <h2 className="works-name">{project.title}</h2>
            <div className="works-subtitle">{project.subtitle}</div>
            <p className="works-desc">{project.desc}</p>

            <div className="works-actions">
              <button
                type="button"
                className="works-link works-link-button"
                onClick={() => openPath(project.route)}
              >
                <i className="fa-solid fa-arrow-right" />
                Open Project
              </button>
              {renderMetaLink(project)}
            </div>
          </div>
        </div>

        <div className="works-arrows">
          <button className="works-arrow-btn" onClick={() => go(-1)}>
            <ArrowIcon dir="left" size="clamp(0.9rem,4vw,1.5rem)" /> PREV
          </button>
          <button className="works-arrow-btn" onClick={() => go(1)}>
            NEXT <ArrowIcon dir="right" size="clamp(0.9rem,4vw,1.5rem)" />
          </button>
        </div>
      </div>

      <footer className="footer"><p>&copy; Riccardo Del Giudice</p></footer>
    </>
  )
}
