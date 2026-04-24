'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import styles from './GameShowcase.module.css'

const games = [
  {
    title: 'Cyber Legends',
    genre: 'Battle Royale',
    color: 'var(--primary)',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
  },
  {
    title: 'Stellar Warfare',
    genre: 'Space Combat',
    color: 'var(--secondary)',
    image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&q=80'
  },
  {
    title: 'Shadow Realm',
    genre: 'Action RPG',
    color: 'var(--accent)',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80'
  }
]

export default function GameShowcase() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section id="games" className={styles.showcase} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className={styles.header}
      >
        <h2 className={styles.title}>EPIC GAME LIBRARY</h2>
        <p className={styles.subtitle}>Dive into our exclusive collection</p>
      </motion.div>

      <div className={styles.grid}>
        {games.map((game, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, rotateZ: 2 }}
            className={styles.gameCard}
            style={{ borderColor: game.color }}
          >
            <motion.div
              className={styles.gameImage}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${game.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={styles.playIcon}
                whileHover={{ scale: 1.3, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                ▶
              </motion.div>
              <div className={styles.gameOverlay} />
            </motion.div>
            <div className={styles.gameInfo}>
              <h3 className={styles.gameTitle}>{game.title}</h3>
              <p className={styles.gameGenre}>{game.genre}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
