import gsap from 'gsap'

/* ─────────────────────────────────────────────────────────
   NAME: animate each letter from below
   ───────────────────────────────────────────────────────── */
export function animateName(lineIds) {
  let totalDelay = 0.15

  lineIds.forEach((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const letters = el.querySelectorAll('span')

    gsap.fromTo(
      letters,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.055,
        delay: totalDelay,
      }
    )
    totalDelay += letters.length * 0.055 + 0.08
  })
}

/* ─────────────────────────────────────────────────────────
   SECTIONS: fade + blur in on scroll snap
   ───────────────────────────────────────────────────────── */
export function initSectionFade(mainEl) {
  if (!mainEl) return

  const sections = mainEl.querySelectorAll('.section')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return

        const sec = entry.target
        observer.unobserve(sec)
        gsap.to(sec, {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          clearProps: 'transform',
        })
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -12% 0px',
    }
  )

  sections.forEach((sec, i) => {
    if (i === 0) return // hero already visible

    gsap.set(sec, { autoAlpha: 0, y: 30 })
    observer.observe(sec)
  })

  return () => {
    observer.disconnect()
  }
}

/* ─────────────────────────────────────────────────────────
   NAV: fade-in on mount
   ───────────────────────────────────────────────────────── */
export function animateNav() {
  const nav = document.getElementById('nav-desktop') || document.getElementById('nav-mobile')
  if (!nav) return
  gsap.fromTo(
    nav,
    { autoAlpha: 0, y: -10 },
    { autoAlpha: 1, y: 0, duration: 0.75, delay: 0.5, ease: 'power2.out' }
  )
}

/* ─────────────────────────────────────────────────────────
   WORKS: fade project content change
   ───────────────────────────────────────────────────────── */
export function fadeOutWorks(targets, onComplete) {
  gsap.to(targets, {
    opacity: 0,
    y: 10,
    duration: 0.3,
    ease: 'power2.in',
    onComplete,
  })
}

export function fadeInWorks(targets) {
  gsap.fromTo(
    targets,
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', clearProps: 'transform' }
  )
}
