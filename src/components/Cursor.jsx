import { useEffect, useRef } from 'react'

const VIEW_SELECTOR = '[data-cursor="view"]'

function getCursorMeta(target) {
  if (!(target instanceof Element)) {
    return { mode: 'default', label: 'VIEW' }
  }

  const viewTarget = target.closest(VIEW_SELECTOR)
  if (viewTarget) {
    return {
      mode: 'view',
      label: viewTarget.getAttribute('data-cursor-label') || 'VIEW',
    }
  }

  return { mode: 'default', label: 'VIEW' }
}

export default function Cursor() {
  const systemRef = useRef(null)
  const orbRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!finePointer) return

    const system = systemRef.current
    const orb = orbRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!system || !orb || !ring || !label) return

    const pointer = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      visible: false,
    }

    const follower = {
      x: pointer.x,
      y: pointer.y,
      opacity: 0,
      scale: 1,
    }

    const deformation = {
      stretch: 0,
      angle: 0,
    }

    let currentMode = 'default'
    let frameId = 0
    let ticking = false

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const lerpAngle = (from, to, alpha) => {
      const diff = ((((to - from) % 360) + 540) % 360) - 180
      return from + diff * alpha
    }

    const setMode = (mode, nextLabel = 'VIEW') => {
      if (mode === currentMode && label.textContent === nextLabel) return

      currentMode = mode
      system.dataset.mode = mode
      label.textContent = nextLabel
    }

    const syncMode = (target) => {
      const meta = getCursorMeta(target)
      setMode(meta.mode, meta.label)
    }

    const render = () => {
      const targetOpacity = pointer.visible ? 1 : 0
      const targetScale = currentMode === 'view' ? 1.38 : 1
      const previousX = follower.x
      const previousY = follower.y

      follower.x += (pointer.x - follower.x) * 0.29
      follower.y += (pointer.y - follower.y) * 0.29
      follower.opacity += (targetOpacity - follower.opacity) * 0.18
      follower.scale += (targetScale - follower.scale) * 0.24

      const velocityX = follower.x - previousX
      const velocityY = follower.y - previousY
      const speed = Math.hypot(velocityX, velocityY)
      const targetStretch = clamp(speed * 0.55, 0, 0.16)
      const targetAngle =
        speed > 0.01
          ? (Math.atan2(velocityY, velocityX) * 180) / Math.PI
          : deformation.angle

      deformation.stretch += (targetStretch - deformation.stretch) * 0.18
      deformation.angle = lerpAngle(
        deformation.angle,
        targetAngle,
        speed > 0.01 ? 0.26 : 0.12
      )

      const displayX = Math.round(follower.x * 2) / 2
      const displayY = Math.round(follower.y * 2) / 2
      const scaleX = follower.scale * (1 + deformation.stretch)
      const scaleY = follower.scale * (1 - deformation.stretch * 0.72)

      orb.style.opacity = `${follower.opacity}`
      orb.style.transform =
        `translate3d(${displayX}px, ${displayY}px, 0) translate(-50%, -50%)`
      ring.style.transform =
        `rotate(${deformation.angle.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`

      const isSettled =
        Math.abs(pointer.x - follower.x) < 0.12 &&
        Math.abs(pointer.y - follower.y) < 0.12 &&
        Math.abs(targetOpacity - follower.opacity) < 0.015 &&
        Math.abs(targetScale - follower.scale) < 0.015 &&
        deformation.stretch < 0.01

      if (isSettled) {
        ticking = false
        return
      }

      frameId = window.requestAnimationFrame(render)
    }

    const startRender = () => {
      if (ticking) return
      ticking = true
      frameId = window.requestAnimationFrame(render)
    }

    const handleMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.visible = true
      syncMode(event.target)
      startRender()
    }

    const handleOver = (event) => {
      syncMode(event.target)
      startRender()
    }

    const handleLeave = () => {
      pointer.visible = false
      setMode('default')
      startRender()
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerover', handleOver, { passive: true })
    document.addEventListener('mouseleave', handleLeave)

    startRender()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerover', handleOver)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div className="cursor-system" ref={systemRef} data-mode="default" aria-hidden="true">
      <div className="cursor-orb" ref={orbRef}>
        <span className="cursor-orb__ring" ref={ringRef} />
        <span className="cursor-label" ref={labelRef}>VIEW</span>
      </div>
    </div>
  )
}
