'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailsRef = useRef<HTMLDivElement>(null)
  const lastTrailTime = useRef(0)
  const trailPool = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const cursor = cursorRef.current
    const trailsContainer = trailsRef.current
    if (!cursor || !trailsContainer) return

    // Pre-create trail elements for reuse (object pooling)
    for (let i = 0; i < 5; i++) {
      const trail = document.createElement('div')
      trail.className = 'mouse-trail'
      trail.style.display = 'none'
      trailsContainer.appendChild(trail)
      trailPool.current.push(trail)
    }

    let currentTrailIndex = 0

    const handleMouseMove = (e: MouseEvent) => {
      // Update cursor position directly
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`

      // Throttle trail creation - every 100ms
      const now = Date.now()
      if (now - lastTrailTime.current > 100) {
        lastTrailTime.current = now

        const trail = trailPool.current[currentTrailIndex]
        trail.style.left = `${e.clientX}px`
        trail.style.top = `${e.clientY}px`
        trail.style.display = 'block'
        trail.style.animation = 'none'

        // Trigger reflow to restart animation
        void trail.offsetWidth
        trail.style.animation = 'trailFade 0.3s ease-out forwards'

        currentTrailIndex = (currentTrailIndex + 1) % trailPool.current.length
      }
    }

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      const progressBar = document.querySelector('.scroll-progress') as HTMLElement
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div className="cursor-crosshair" />
        <div className="cursor-center" />
        <div className="cursor-ring" />
      </div>

      {/* Trails Container */}
      <div ref={trailsRef} />
    </>
  )
}
