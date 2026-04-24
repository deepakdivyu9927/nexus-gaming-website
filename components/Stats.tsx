'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import styles from './Stats.module.css'

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let start = 0
      const duration = 2000
      const increment = value / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.round(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const stats = [
    { value: 10, suffix: 'M+', label: 'Active Players' },
    { value: 50, suffix: '+', label: 'Game Titles' },
    { value: 240, suffix: ' FPS', label: 'Performance' },
    { value: 99, suffix: '%', label: 'Uptime' },
  ]

  return (
    <section id="stats" className={styles.stats} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={styles.header}
      >
        <h2 className={styles.title}>THE NUMBERS SPEAK</h2>
        <p className={styles.subtitle}>Join the revolution</p>
      </motion.div>

      <div className={styles.grid}>
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={styles.statCard}
          >
            <motion.div
              className={styles.value}
              whileHover={{ scale: 1.1 }}
            >
              <Counter value={stat.value} suffix={stat.suffix} />
            </motion.div>
            <div className={styles.label}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
