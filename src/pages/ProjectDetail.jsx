import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ArrowIcon from '../components/ArrowIcon'
import { PROJECTS, getProjectBySlug } from '../data/projects'
import '../styles/project-detail.css'

export default function ProjectDetail() {
  const navigate = useNavigate()
  const { slug } = useParams()
  const videoRef = useRef(null)
  const project = getProjectBySlug(slug)
  const projectIndex = project ? PROJECTS.findIndex((item) => item.slug === project.slug) : -1
  const counter = project
    ? `[ ${String(projectIndex + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')} ]`
    : null

  const openPath = (path) => {
    if (window.__nav) {
      window.__nav(path)
      return
    }

    navigate(path)
  }

  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
      window.__lenis.resize()
    } else {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current

    if (!project?.video || !video) {
      return
    }

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.preload = 'auto'

    const attemptPlayback = () => {
      const playPromise = video.play()

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {})
      }
    }

    attemptPlayback()
    video.addEventListener('loadeddata', attemptPlayback)
    document.addEventListener('visibilitychange', attemptPlayback)

    return () => {
      video.removeEventListener('loadeddata', attemptPlayback)
      document.removeEventListener('visibilitychange', attemptPlayback)
    }
  }, [project?.video])

  if (!project) {
    return (
      <>
        <main className="project-detail-page">
          <div className="project-detail-topbar">
            <button
              type="button"
              className="project-detail-back"
              onClick={() => openPath('/works')}
            >
              <ArrowIcon dir="left" size="clamp(0.85rem,1.2vw,1rem)" />
              BACK
            </button>
          </div>

          <div className="project-detail-title-block">
            <h1 className="project-detail-title">Project Not Found</h1>
          </div>
          <div className="project-detail-divider" />

          <section className="project-detail-layout">
            <div className="project-detail-copy">
              <div className="project-detail-block">
                <span className="project-detail-label">Status</span>
                <p className="project-detail-text">
                  The requested project page does not exist. You can go back to the works overview and open another project.
                </p>
              </div>
            </div>
          </section>
        </main>
        <footer className="footer"><p>&copy; Riccardo Del Giudice</p></footer>
      </>
    )
  }

  const hasVideo = Boolean(project.video)
  const mediaClass = hasVideo
    ? project.mediaLayout === 'landscape'
      ? ' is-video-wide'
      : ' is-video-plain'
    : ' is-cover'

  const renderMetaAction = () => {
    if (project.link) {
      if (project.link.startsWith('http')) {
        return (
          <a
            className="project-detail-meta-link"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className={project.linkIcon} />
            {project.linkLabel}
          </a>
        )
      }

      return (
        <button
          type="button"
          className="project-detail-meta-link project-detail-meta-button"
          onClick={() => openPath(project.link)}
        >
          <i className={project.linkIcon} />
          {project.linkLabel}
        </button>
      )
    }

    if (project.isPrivate) {
      return <span className="project-detail-private">Private Project</span>
    }

    return null
  }

  return (
    <>
      <main className="project-detail-page">
        <div className="project-detail-topbar">
          <button
            type="button"
            className="project-detail-back"
            onClick={() => openPath('/works')}
          >
            <ArrowIcon dir="left" size="clamp(0.85rem,1.2vw,1rem)" />
            BACK
          </button>

          {renderMetaAction()}
        </div>

        <div className="project-detail-title-block">
          <div className="project-detail-counter">{counter}</div>
          <div className="project-detail-title-row">
            <h1 className="project-detail-title">{project.title}</h1>
            <span className="project-detail-subtitle">{project.subtitle}</span>
          </div>
        </div>
        <div className="project-detail-divider" />

        <section className="project-detail-layout">
          <div className="project-detail-stage">
            <div className={`project-detail-media-shell${mediaClass}`}>
              {hasVideo ? (
                <video
                  ref={videoRef}
                  className="project-detail-video"
                  src={project.video}
                  poster={project.image}
                  autoPlay
                  muted
                  defaultMuted
                  loop
                  playsInline
                  preload="auto"
                  aria-label={`${project.title} demo video`}
                />
              ) : (
                <img
                  className="project-detail-poster"
                  src={project.image}
                  alt={`${project.title} cover`}
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          </div>

          <div className="project-detail-copy">
            <div className="project-detail-block">
              <span className="project-detail-label">Overview</span>
              <p className="project-detail-text">{project.overview}</p>
            </div>

            <div className="project-detail-block">
              <span className="project-detail-label">Stack</span>
              <div className="project-detail-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="project-detail-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer"><p>&copy; Riccardo Del Giudice</p></footer>
    </>
  )
}
