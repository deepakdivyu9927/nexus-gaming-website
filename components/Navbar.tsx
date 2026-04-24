'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Navbar.module.css'

const playBeep = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(900, audioContext.currentTime)
  gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.05)
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Update active section
      const sections = ['home', 'features', 'games', 'stats']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 200 && rect.bottom >= 200
        }
        return false
      })
      if (currentSection) setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Games', href: '#games' },
    { name: 'Stats', href: '#stats' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
    >
      <motion.div
        className={styles.logo}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        NEXUS
      </motion.div>

      <div className={styles.navLinks}>
        {navItems.map((item, index) => (
          <motion.a
            key={item.name}
            href={item.href}
            className={activeSection === item.href.slice(1) ? styles.active : ''}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={playBeep}
          >
            {item.name}
          </motion.a>
        ))}
      </div>

      <motion.button
        className={styles.ctaBtn}
        whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255, 107, 53, 0.6)' }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={playBeep}
      >
        JOIN NOW
      </motion.button>
    </motion.nav>
  )
}
