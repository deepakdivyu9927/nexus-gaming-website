'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './Hero.module.css'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [soundLoaded, setSoundLoaded] = useState(false)

  // Sound effects with shared AudioContext
  const audioContextRef = useRef<AudioContext | null>(null)

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
  }

  const playSound = (type: 'click' | 'hover' | 'deploy' | 'nexusHover') => {
    try {
      initAudio()
      if (!audioContextRef.current) return

      const audioContext = audioContextRef.current
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (type === 'click') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.15)
      } else if (type === 'hover') {
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.05)
      } else if (type === 'nexusHover') {
        // COD-style tactical beep for NEXUS letters
        oscillator.type = 'square'
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(900, audioContext.currentTime + 0.06)
        gainNode.gain.setValueAtTime(0.12, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.06)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.06)
      } else if (type === 'deploy') {
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.25)
      }
    } catch (error) {
      console.error('Sound playback error:', error)
    }
  }

  useEffect(() => {
    // Initialize audio on first user interaction
    const handleFirstInteraction = () => {
      initAudio()
      setSoundLoaded(true)
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('mousemove', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('mousemove', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('mousemove', handleFirstInteraction)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Warzone background layers
    const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
    gradient.addColorStop(0, '#1a1a1a')
    gradient.addColorStop(0.5, '#0d0d0d')
    gradient.addColorStop(1, '#000000')

    // Urban ruins silhouettes
    const buildings = [
      { x: 0, width: canvas.width * 0.2, height: canvas.height * 0.4 },
      { x: canvas.width * 0.25, width: canvas.width * 0.15, height: canvas.height * 0.5 },
      { x: canvas.width * 0.45, width: canvas.width * 0.1, height: canvas.height * 0.35 },
      { x: canvas.width * 0.6, width: canvas.width * 0.2, height: canvas.height * 0.45 },
      { x: canvas.width * 0.85, width: canvas.width * 0.15, height: canvas.height * 0.3 },
    ]

    // Heavy smoke particles
    const smokeParticles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
      life: number
    }> = []

    for (let i = 0; i < 150; i++) {
      smokeParticles.push({
        x: Math.random() * canvas.width,
        y: canvas.height * 0.3 + Math.random() * canvas.height * 0.7,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 0.5 - 0.2,
        size: Math.random() * 60 + 30,
        alpha: Math.random() * 0.4 + 0.2,
        life: Math.random() * Math.PI * 2,
      })
    }

    // Debris particles
    const debris: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      rotation: number
      rotationSpeed: number
    }> = []

    for (let i = 0; i < 30; i++) {
      debris.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 4 + 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }

    // Explosions with shockwaves
    const explosions: Array<{
      x: number
      y: number
      radius: number
      maxRadius: number
      alpha: number
      shockwave: number
    }> = []

    function createExplosion() {
      if (Math.random() > 0.985) {
        const x = Math.random() * canvas.width
        const y = canvas.height * 0.4 + Math.random() * canvas.height * 0.3

        explosions.push({
          x,
          y,
          radius: 0,
          maxRadius: Math.random() * 100 + 80,
          alpha: 1,
          shockwave: 0,
        })

        // Add smoke at explosion point
        for (let i = 0; i < 10; i++) {
          smokeParticles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -Math.random() * 2 - 1,
            size: Math.random() * 40 + 20,
            alpha: 0.6,
            life: 0,
          })
        }
      }
    }

    // Tracer bullets
    const tracers: Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      progress: number
      speed: number
    }> = []

    function createTracer() {
      if (Math.random() > 0.97) {
        const startSide = Math.random() > 0.5
        tracers.push({
          x: startSide ? 0 : canvas.width,
          y: canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.4,
          targetX: startSide ? canvas.width : 0,
          targetY: canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.4,
          progress: 0,
          speed: Math.random() * 0.05 + 0.08,
        })
      }
    }

    // Muzzle flashes
    const muzzleFlashes: Array<{
      x: number
      y: number
      size: number
      alpha: number
    }> = []

    function createMuzzleFlash() {
      if (Math.random() > 0.96) {
        muzzleFlashes.push({
          x: Math.random() * canvas.width,
          y: canvas.height * 0.5 + (Math.random() - 0.5) * canvas.height * 0.3,
          size: Math.random() * 15 + 10,
          alpha: 1,
        })
      }
    }

    // Searchlight/helicopter light
    const searchlight = {
      x: canvas.width * 0.5,
      y: canvas.height * 0.2,
      targetX: canvas.width * 0.5,
      angle: 0,
      radius: 150,
    }

    let animationFrame = 0

    function animate() {
      if (!canvas || !ctx) return

      animationFrame++

      // Dark battlefield base
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw ruined buildings silhouettes
      buildings.forEach((building) => {
        const buildingGradient = ctx.createLinearGradient(
          building.x,
          canvas.height,
          building.x,
          canvas.height - building.height
        )
        buildingGradient.addColorStop(0, '#1a1a1a')
        buildingGradient.addColorStop(1, '#0d0d0d')

        ctx.fillStyle = buildingGradient
        ctx.fillRect(building.x, canvas.height - building.height, building.width, building.height)

        // Broken windows
        for (let i = 0; i < 20; i++) {
          if (Math.random() > 0.7) {
            ctx.fillStyle = Math.random() > 0.9 ? 'rgba(255, 107, 53, 0.3)' : 'rgba(0, 0, 0, 0.5)'
            const wx = building.x + Math.random() * building.width
            const wy = canvas.height - building.height + Math.random() * building.height * 0.8
            ctx.fillRect(wx, wy, 8, 12)
          }
        }
      })

      // Atmospheric fog layers
      for (let i = 0; i < 3; i++) {
        const fogGradient = ctx.createLinearGradient(0, canvas.height * (0.6 + i * 0.1), 0, canvas.height)
        fogGradient.addColorStop(0, `rgba(60, 60, 60, ${0.05 + i * 0.02})`)
        fogGradient.addColorStop(1, 'transparent')
        ctx.fillStyle = fogGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Smoke particles
      smokeParticles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.life += 0.015
        p.alpha = Math.max(0, p.alpha - 0.002)

        if (p.y < -100 || p.alpha <= 0) {
          smokeParticles.splice(index, 1)
          return
        }

        if (p.x < -100 || p.x > canvas.width + 100) {
          p.vx *= -0.8
        }

        const smokeGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        smokeGradient.addColorStop(0, `rgba(90, 90, 90, ${p.alpha})`)
        smokeGradient.addColorStop(0.5, `rgba(60, 60, 60, ${p.alpha * 0.6})`)
        smokeGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = smokeGradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Debris
      debris.forEach((d) => {
        d.x += d.vx
        d.y += d.vy
        d.rotation += d.rotationSpeed

        if (d.y > canvas.height) {
          d.y = 0
          d.x = Math.random() * canvas.width
        }

        ctx.save()
        ctx.translate(d.x, d.y)
        ctx.rotate(d.rotation)
        ctx.fillStyle = 'rgba(100, 100, 100, 0.6)'
        ctx.fillRect(-d.size / 2, -d.size / 2, d.size, d.size)
        ctx.restore()
      })

      // Explosions
      createExplosion()
      explosions.forEach((exp, index) => {
        exp.radius += (exp.maxRadius - exp.radius) * 0.2
        exp.alpha -= 0.015
        exp.shockwave += 8

        if (exp.alpha > 0) {
          // Bright core
          const coreGradient = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, exp.radius * 0.5)
          coreGradient.addColorStop(0, `rgba(255, 255, 200, ${exp.alpha})`)
          coreGradient.addColorStop(0.3, `rgba(255, 180, 100, ${exp.alpha * 0.8})`)
          coreGradient.addColorStop(1, 'transparent')

          ctx.fillStyle = coreGradient
          ctx.beginPath()
          ctx.arc(exp.x, exp.y, exp.radius * 0.5, 0, Math.PI * 2)
          ctx.fill()

          // Orange glow
          const glowGradient = ctx.createRadialGradient(exp.x, exp.y, exp.radius * 0.3, exp.x, exp.y, exp.radius)
          glowGradient.addColorStop(0, `rgba(255, 107, 53, ${exp.alpha * 0.6})`)
          glowGradient.addColorStop(0.5, `rgba(255, 80, 30, ${exp.alpha * 0.3})`)
          glowGradient.addColorStop(1, 'transparent')

          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2)
          ctx.fill()

          // Shockwave ring
          if (exp.shockwave < exp.maxRadius * 1.5) {
            ctx.strokeStyle = `rgba(255, 200, 150, ${(1 - exp.shockwave / (exp.maxRadius * 1.5)) * 0.5})`
            ctx.lineWidth = 3
            ctx.beginPath()
            ctx.arc(exp.x, exp.y, exp.shockwave, 0, Math.PI * 2)
            ctx.stroke()
          }
        } else {
          explosions.splice(index, 1)
        }
      })

      // Tracer bullets
      createTracer()
      tracers.forEach((tracer, index) => {
        tracer.progress += tracer.speed

        if (tracer.progress >= 1) {
          tracers.splice(index, 1)
          return
        }

        const currentX = tracer.x + (tracer.targetX - tracer.x) * tracer.progress
        const currentY = tracer.y + (tracer.targetY - tracer.y) * tracer.progress

        // Tracer trail
        const trailLength = 30
        for (let i = 0; i < trailLength; i++) {
          const t = tracer.progress - (i / trailLength) * 0.1
          if (t < 0) continue

          const tx = tracer.x + (tracer.targetX - tracer.x) * t
          const ty = tracer.y + (tracer.targetY - tracer.y) * t
          const alpha = (1 - i / trailLength) * 0.8

          ctx.fillStyle = `rgba(255, 200, 100, ${alpha})`
          ctx.beginPath()
          ctx.arc(tx, ty, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Bright head
        ctx.shadowBlur = 15
        ctx.shadowColor = 'rgba(255, 200, 100, 1)'
        ctx.fillStyle = 'rgba(255, 220, 150, 1)'
        ctx.beginPath()
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Muzzle flashes
      createMuzzleFlash()
      muzzleFlashes.forEach((flash, index) => {
        flash.alpha -= 0.1

        if (flash.alpha > 0) {
          ctx.shadowBlur = 20
          ctx.shadowColor = 'rgba(255, 200, 100, 1)'

          // Star-shaped flash
          ctx.save()
          ctx.translate(flash.x, flash.y)
          ctx.fillStyle = `rgba(255, 220, 150, ${flash.alpha})`

          for (let i = 0; i < 8; i++) {
            ctx.rotate(Math.PI / 4)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(flash.size, -flash.size * 0.3)
            ctx.lineTo(flash.size, flash.size * 0.3)
            ctx.closePath()
            ctx.fill()
          }

          ctx.restore()
          ctx.shadowBlur = 0
        } else {
          muzzleFlashes.splice(index, 1)
        }
      })

      // Helicopter searchlight
      if (animationFrame % 3 === 0) {
        searchlight.targetX = canvas.width * 0.3 + Math.random() * canvas.width * 0.4
      }
      searchlight.x += (searchlight.targetX - searchlight.x) * 0.05
      searchlight.angle += 0.01

      const lightGradient = ctx.createRadialGradient(
        searchlight.x,
        searchlight.y,
        0,
        searchlight.x,
        canvas.height,
        searchlight.radius
      )
      lightGradient.addColorStop(0, 'rgba(255, 255, 200, 0.05)')
      lightGradient.addColorStop(0.3, 'rgba(255, 255, 200, 0.02)')
      lightGradient.addColorStop(1, 'transparent')

      ctx.fillStyle = lightGradient
      ctx.beginPath()
      ctx.moveTo(searchlight.x, searchlight.y)
      ctx.arc(searchlight.x, canvas.height, searchlight.radius, -Math.PI * 0.7, -Math.PI * 0.3)
      ctx.closePath()
      ctx.fill()

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section id="home" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.vignette} />
      <div className={styles.noise} />

      <div className={styles.content}>
        {/* Tactical HUD Elements */}
        <div className={styles.hudTopLeft}>
          <div className={styles.hudLine} />
          <div className={styles.hudText}>SYS_ONLINE</div>
        </div>

        <div className={styles.hudTopRight}>
          <div className={styles.hudText}>CONNECTION_SECURE</div>
          <div className={styles.hudLine} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className={styles.mainContent}
        >
          <div className={styles.classification}>[ CLASSIFIED ]</div>

          <h1 className={styles.title}>
            <span className={styles.titleStroke}>NEXUS</span>
            <span className={styles.titleMain}>
              {'NEXUS'.split('').map((letter, index) => (
                <span
                  key={index}
                  className={styles.letter}
                  onMouseEnter={() => playSound('nexusHover')}
                >
                  {letter}
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.subtitle}>
            <div className={styles.subtitleLine} />
            TACTICAL WARFARE PLATFORM
            <div className={styles.subtitleLine} />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className={styles.description}
          >
            PRECISION • STRATEGY • DOMINATION
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className={styles.buttons}
          >
            <button
              className={styles.primaryBtn}
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('deploy')}
            >
              <span className={styles.btnBracket}>[</span>
              <span className={styles.btnText}>DEPLOY NOW</span>
              <span className={styles.btnBracket}>]</span>
            </button>

            <button
              className={styles.secondaryBtn}
              onMouseEnter={() => playSound('hover')}
              onClick={() => playSound('click')}
            >
              <span className={styles.btnBracket}>[</span>
              <span className={styles.btnText}>INTEL BRIEF</span>
              <span className={styles.btnBracket}>]</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className={styles.stats}
          >
            <div className={styles.stat}>
              <div className={styles.statLabel}>OPERATIVES</div>
              <div className={styles.statValue}>10M+</div>
            </div>
            <div className={styles.statSeparator}>|</div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>WIN RATE</div>
              <div className={styles.statValue}>98.7%</div>
            </div>
            <div className={styles.statSeparator}>|</div>
            <div className={styles.stat}>
              <div className={styles.statLabel}>MISSIONS</div>
              <div className={styles.statValue}>500K+</div>
            </div>
          </motion.div>
        </motion.div>

        {/* HUD Bottom Elements */}
        <div className={styles.hudBottomLeft}>
          <div className={styles.hudLine} />
          <div className={styles.hudText}>LAT: 28.6139° N</div>
        </div>

        <div className={styles.hudBottomRight}>
          <div className={styles.hudText}>LONG: 77.2090° E</div>
          <div className={styles.hudLine} />
        </div>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={styles.scrollArrow}>↓</div>
        <div className={styles.scrollText}>SCROLL TO CONTINUE</div>
      </motion.div>
    </section>
  )
}
