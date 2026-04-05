import { useEffect, useRef } from 'react'
import { animateName, initSectionFade } from '../animations/gsap'
import ArrowIcon from '../components/ArrowIcon'
import profilePhoto from '../assets/IMG_3974-optimized.webp'
import '../styles/home.css'

const SKILLS = {
  DEVELOPMENT: ['Front-end Web', 'Desktop Applications', 'Software Architecture', 'p5.js'],
  'DATA & AI': ['Data Processing', 'API Integration', 'AI Systems (RAG)'],
  TOOLS: ['VS Code', 'Linux / Windows', 'Problem Solving'],
}

const NAME_LINES = [
  { id: 'nl-1', letters: ['R', 'I', 'C', 'C', 'A', 'R', 'D', 'O'] },
  { id: 'nl-2', letters: ['D', 'E', 'L'] },
  { id: 'nl-3', letters: ['G', 'I', 'U', 'D', 'I', 'C', 'E'] },
]

function Section({ id, children, style }) {
  return (
    <section className="section" id={id} style={style}>
      {children}
    </section>
  )
}

function SectionBlock({ label, wide, children }) {
  return (
    <div>
      <div className="section-label-wrap">
        <h2 className="section-label">{label}</h2>
      </div>
      <div className={`divider${wide ? ' wide' : ''}`} />
      {children}
    </div>
  )
}

function Hero() {
  return (
    <Section id="s-hero" style={{ opacity: 1 }}>
      <div className="hero-left">
        <div>
          <div className="hero-name">
            {NAME_LINES.map(({ id, letters }) => (
              <div className="name-row" key={id}>
                <h1 className="name-line" id={id}>
                  {letters.map((letter, index) => (
                    <span key={index}>{letter}</span>
                  ))}
                </h1>
              </div>
            ))}
          </div>
          <div className="hero-role">Computer Science</div>
        </div>
        <div className="hero-contact">
          <p>For business inquiries, email me at</p>
          <a href="mailto:hello.riccardodelgiudice@gmail.com">
            hello.riccardodelgiudice@gmail.com
          </a>
        </div>
      </div>

      <div className="hero-right">
        <SectionBlock label="ABOUT ME">
          <div className="section-text">
            <p>I am a Computer Science student at Ca' Foscari University of Venice.</p>
            <p>I develop web applications, desktop software, and experimental solutions, with a growing interest in data processing and AI-based systems.</p>
            <p>I am always looking for new challenges to improve my skills and build concrete, real-world projects.</p>
          </div>
        </SectionBlock>
      </div>
    </Section>
  )
}

function Motivation({ photoWrapRef, photoImageRef }) {
  return (
    <Section id="s-motivation">
      <div className="motivation-left">
        <SectionBlock label="MOTIVATION">
          <div className="section-text">
            <p>I am still exploring the direction I want to take, but I have realized that building things, from web applications to AI software, is what excites me the most.</p>
            <p>That is why I dedicate my energy both to strengthening my technical foundations and to experimenting with creative, concrete projects.</p>
          </div>
        </SectionBlock>
      </div>

      <div className="photo-wrap" data-cursor="hover" ref={photoWrapRef}>
        <div className="photo-inner">
          <img
            ref={photoImageRef}
            src={profilePhoto}
            alt="Riccardo Del Giudice"
            width="1800"
            height="1350"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            draggable="false"
          />
        </div>
      </div>
    </Section>
  )
}

function Skills() {
  return (
    <Section id="s-skills" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ width: '100%' }}>
        <SectionBlock label="SKILLS" wide>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([category, tags]) => (
              <div className="skill-col" key={category}>
                <h3 className="skill-cat">{category}</h3>
                <div className="tags">
                  {tags.map((tag) => (
                    <span className="tag" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionBlock>

        <div className="skills-nav">
          <button
            className="arrow-link"
            style={{ background: 'none', border: 'none', padding: 0 }}
            onClick={() => window.__nav && window.__nav('/works')}
          >
            <span>WORKS</span>
            <ArrowIcon />
          </button>
        </div>
      </div>
    </Section>
  )
}

export default function Home() {
  const mainRef = useRef(null)
  const photoWrapRef = useRef(null)
  const photoImageRef = useRef(null)

  useEffect(() => {
    animateName(['nl-1', 'nl-2', 'nl-3'])
    return initSectionFade(mainRef.current)
  }, [])

  useEffect(() => {
    const photoWrap = photoWrapRef.current
    const photoImage = photoImageRef.current
    if (!photoWrap || !photoImage) return

    let frameId = 0
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    let lenisInstance = window.__lenis
    let detachLenis = null
    let currentOffset = 0
    let targetOffset = 0
    let frameTop = 0
    let frameHeight = 0

    const measureLayout = () => {
      const scrollValue = lenisInstance ? lenisInstance.scroll : window.scrollY
      const rect = photoWrap.getBoundingClientRect()
      frameTop = rect.top + scrollValue
      frameHeight = rect.height
    }

    const measureTarget = () => {
      const scrollValue = lenisInstance ? lenisInstance.scroll : window.scrollY
      const viewportCenter = window.innerHeight * 0.5
      const frameCenter = frameTop - scrollValue + frameHeight * 0.5
      const progress = (viewportCenter - frameCenter) / window.innerHeight
      const clamped = Math.max(-1, Math.min(1, progress))
      const travel = desktopQuery.matches ? 42 : 28
      targetOffset = clamped * travel
    }

    const renderParallax = () => {
      currentOffset += (targetOffset - currentOffset) * 0.1

      if (Math.abs(targetOffset - currentOffset) < 0.04) {
        currentOffset = targetOffset
      }

      photoImage.style.setProperty('--photo-offset-y', `${currentOffset.toFixed(2)}px`)

      if (Math.abs(targetOffset - currentOffset) >= 0.04) {
        frameId = window.requestAnimationFrame(renderParallax)
      } else {
        frameId = 0
      }
    }

    const requestUpdate = () => {
      measureTarget()
      if (frameId) return
      frameId = window.requestAnimationFrame(renderParallax)
    }

    const onReady = () => {
      photoImage.style.removeProperty('opacity')
      window.__lenis?.resize()
      measureLayout()
      requestUpdate()
    }

    if ('decode' in photoImage) {
      photoImage.decode().then(onReady).catch(onReady)
    } else if (photoImage.complete) {
      onReady()
    } else {
      photoImage.addEventListener('load', onReady, { once: true })
    }

    const handleResize = () => {
      lenisInstance = window.__lenis
      measureLayout()
      requestUpdate()
    }

    window.addEventListener('resize', handleResize)

    if (lenisInstance) {
      detachLenis = lenisInstance.on('scroll', requestUpdate)
    } else {
      window.addEventListener('scroll', requestUpdate, { passive: true })
    }

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', requestUpdate)
      detachLenis?.()
      photoImage.removeEventListener('load', onReady)
    }
  }, [])

  return (
    <>
      <main className="home-main" ref={mainRef} id="main">
        <Hero />
        <Motivation photoWrapRef={photoWrapRef} photoImageRef={photoImageRef} />
        <Skills />
      </main>
      <footer className="footer"><p>&copy; Riccardo Del Giudice</p></footer>
    </>
  )
}
