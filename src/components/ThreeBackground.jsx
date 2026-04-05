import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeBackground({ isDark }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const materialRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 5

    const count = 3500
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 1) {
      positions[i] = (Math.random() - 0.5) * 20
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })

    materialRef.current = material

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    const syncTheme = () => {
      renderer.setClearColor(isDark ? 0x000000 : 0xf2f2f2, 1)
      material.color.set(isDark ? 0xffffff : 0x171717)
      material.opacity = isDark ? 0.55 : 0.16
      material.needsUpdate = true
      mount.style.opacity = isDark ? '1' : '0.82'
    }

    let mouseX = 0
    let mouseY = 0

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 0.4
      mouseY = (event.clientY / window.innerHeight - 0.5) * 0.4
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    syncTheme()

    let frameId = 0
    const tick = () => {
      frameId = window.requestAnimationFrame(tick)

      points.rotation.y += 0.00035
      points.rotation.x += 0.00012
      camera.position.x += (mouseX - camera.position.x) * 0.025
      camera.position.y += (-mouseY - camera.position.y) * 0.025

      renderer.render(scene, camera)
    }

    tick()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)

      renderer.dispose()
      geometry.dispose()
      material.dispose()
      rendererRef.current = null
      materialRef.current = null

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    const renderer = rendererRef.current
    const material = materialRef.current

    if (!mount || !renderer || !material) return

    renderer.setClearColor(isDark ? 0x000000 : 0xf2f2f2, 1)
    material.color.set(isDark ? 0xffffff : 0x171717)
    material.opacity = isDark ? 0.55 : 0.16
    material.needsUpdate = true
    mount.style.opacity = isDark ? '1' : '0.82'
  }, [isDark])

  return <div className="three-wrap" ref={mountRef} />
}
