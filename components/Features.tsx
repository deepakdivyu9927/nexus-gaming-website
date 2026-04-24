'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './Features.module.css'

const playSound = (frequency: number, duration: number) => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + duration)
}

const features = [
  {
    icon: '⚡',
    title: 'TACTICAL PRECISION',
    description: 'Military-grade accuracy with advanced aim-assist technology',
    code: 'TAC_001'
  },
  {
    icon: '🎯',
    title: 'STRATEGIC GAMEPLAY',
    description: 'Real-time intel and battlefield awareness systems',
    code: 'STRAT_002'
  },
  {
    icon: '🛡️',
    title: 'SECURE NETWORK',
    description: 'Encrypted communications and anti-cheat protection',
    code: 'SEC_003'
  },
  {
    icon: '⚔️',
    title: 'COMBAT READY',
    description: 'Instant deployment with optimized performance',
    code: 'CMB_004'
  },
  {
    icon: '🎖️',
    title: 'RANKED OPERATIONS',
    description: 'Competitive matchmaking with skill-based ranking',
    code: 'RNK_005'
  },
  {
    icon: '🔫',
    title: 'ARSENAL ACCESS',
    description: 'Extensive weaponry and tactical equipment library',
    code: 'ARM_006'
  }
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="features" className={styles.features} ref={ref}>
      <div className={styles.gridOverlay} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={styles.header}
      >
        <div className={styles.classification}>[ TACTICAL CAPABILITIES ]</div>
        <h2 className={styles.title}>
          <span className={styles.titleLine}>───</span>
          MISSION SPECS
          <span className={styles.titleLine}>───</span>
        </h2>
        <p className={styles.subtitle}>Advanced warfare systems at your command</p>
      </motion.div>

      <div className={styles.grid}>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <span className={styles.cardCode}>[{feature.code}]</span>
              <div className={styles.cardStatus}>
                <div className={styles.statusDot} />
                ACTIVE
              </div>
            </div>

            <div className={styles.cardContent}>
              <motion.div
                className={styles.icon}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {feature.icon}
              </motion.div>

              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.footerLine} />
              <button
                className={styles.cardBtn}
                onMouseEnter={() => playSound(900, 0.05)}
                onClick={() => playSound(150, 0.2)}
              >
                DEPLOY
              </button>
            </div>

            {/* Corner decorations */}
            <div className={styles.cornerTL} />
            <div className={styles.cornerTR} />
            <div className={styles.cornerBL} />
            <div className={styles.cornerBR} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className={styles.cta}
      >
        <div className={styles.ctaBackground} />
        <div className={styles.ctaContent}>
          <div className={styles.ctaIcon}>⚠️</div>
          <h3 className={styles.ctaTitle}>ENLISTMENT OPEN</h3>
          <p className={styles.ctaText}>Join 10 million operators worldwide in tactical dominance</p>
          <button
            className={styles.ctaBtn}
            onMouseEnter={() => playSound(1000, 0.05)}
            onClick={() => playSound(120, 0.3)}
          >
            <span>[</span> ENLIST NOW <span>]</span>
          </button>
        </div>
        <div className={styles.ctaScanline} />
      </motion.div>
    </section>
  )
}
