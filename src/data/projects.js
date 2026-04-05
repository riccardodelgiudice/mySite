import project01ShapeTest from '../assets/projects/project-01-shapetest.webp'
import project02RadiantAndCube from '../assets/projects/project-02-radiantandcube.webp'
import project03Portfolio from '../assets/projects/project-03-portfolio.webp'
import project04RagDashboard from '../assets/projects/project-04-rag-dashboard.webp'
import project01ShapeTestVideo from '../assets/projects/videos/project-01-shapetest-optimized.mp4'
import project02RadiantAndCubeVideo from '../assets/projects/videos/project-02-radiantandcube-optimized.mp4'
import project04RagDashboardVideo from '../assets/projects/videos/project-04-rag-dashboard-optimized.mp4'

export const PROJECTS = [
  {
    id: 0,
    slug: 'gesture-controlled-3d-viewer',
    route: '/works/gesture-controlled-3d-viewer',
    title: 'Gesture-Controlled 3D Viewer',
    subtitle: 'Creative Coding / Computer Vision',
    desc: 'A real-time browser experience built with p5.js and MediaPipe Hands, where webcam-tracked gestures rotate, switch and animate LED-style 3D forms through natural interaction.',
    overview:
      'This project explores gesture-driven control in the browser, translating hand tracking into a fluid way to inspect and manipulate 3D forms in real time.',
    focus:
      'The main goal was to make interaction feel immediate and playful while keeping the visual output readable, reactive and technically lightweight.',
    tags: ['p5.js', 'MediaPipe Hands', 'Webcam Input', '3D Interaction'],
    link: 'https://github.com/riccardodelgiudice/shapeTest',
    linkLabel: 'GitHub',
    linkIcon: 'fa-brands fa-github',
    bg: 'linear-gradient(135deg,#1a1a2e 0%,#0f0f1a 40%,#e94560 100%)',
    image: project01ShapeTest,
    video: project01ShapeTestVideo,
    mediaLayout: 'portrait',
  },
  {
    id: 1,
    slug: 'radiant-geometry-viewer',
    route: '/works/radiant-geometry-viewer',
    title: 'Radiant Geometry Viewer',
    subtitle: 'Creative Coding / Real-Time Graphics',
    desc: 'An expanded hand-tracking experiment with richer LED rendering, multi-axis gesture rotation and a more atmospheric HUD interface for exploring reactive 3D geometry in the browser.',
    overview:
      'This iteration pushes the same tracking logic into a more polished visual direction, with richer forms, stronger feedback and a more intentional interface layer.',
    focus:
      'Compared with the first prototype, the emphasis here is on clarity, visual atmosphere and a more refined sense of motion across the whole realtime scene.',
    tags: ['p5.js', 'MediaPipe Hands', 'HUD Design', 'Realtime Graphics'],
    link: 'https://github.com/riccardodelgiudice/radiantAndCube',
    linkLabel: 'GitHub',
    linkIcon: 'fa-brands fa-github',
    bg: 'linear-gradient(135deg,#08121a 0%,#12343b 42%,#36cfc9 100%)',
    image: project02RadiantAndCube,
    video: project02RadiantAndCubeVideo,
    mediaLayout: 'portrait',
  },
  {
    id: 2,
    slug: 'portfolio-experience',
    route: '/works/portfolio-experience',
    title: 'Portfolio Experience',
    subtitle: 'Frontend / Interactive Design',
    desc: 'A personal portfolio focused on clarity, motion and atmosphere, built to present selected work through smooth transitions, refined interactions and a cohesive light and dark theme system.',
    overview:
      'The portfolio is designed as a quiet, motion-led environment where typography, spacing and transitions feel consistent across every section and theme.',
    focus:
      'The focus is not only on presentation but on the overall browsing feeling, with custom cursor behavior, inertial scrolling and careful attention to visual rhythm.',
    tags: ['React', 'GSAP', 'Lenis', 'UI Motion'],
    link: '/',
    linkLabel: 'Live Site',
    linkIcon: 'fa-solid fa-arrow-up-right-from-square',
    bg: 'linear-gradient(135deg,#0d0d0d 0%,#1f2937 40%,#4f46e5 100%)',
    image: project03Portfolio,
    video: null,
    mediaLayout: 'cover',
  },
  {
    id: 3,
    slug: 'open-data-rag-assistant',
    route: '/works/open-data-rag-assistant',
    title: 'Open Data RAG Assistant',
    subtitle: 'AI / Data Visualization',
    desc: 'A data exploration platform that turns ISTAT and Eurostat sources into visual insights, with a RAG-powered assistant that helps users request and interpret specific indicators in natural language.',
    overview:
      'The project combines public statistical sources with a conversational layer, making specific datasets easier to search, compare and understand visually.',
    focus:
      'The emphasis is on turning complex open data into an approachable interface while preserving flexibility for more targeted user requests through AI-assisted retrieval.',
    tags: ['RAG', 'ISTAT', 'Eurostat', 'Data Visualization'],
    link: null,
    linkLabel: null,
    linkIcon: null,
    bg: 'linear-gradient(135deg,#0d0d0d 0%,#064e3b 40%,#6ee7b7 100%)',
    image: project04RagDashboard,
    video: project04RagDashboardVideo,
    mediaLayout: 'landscape',
    isPrivate: true,
  },
]

export function getProjectBySlug(slug) {
  return PROJECTS.find((project) => project.slug === slug) ?? null
}
