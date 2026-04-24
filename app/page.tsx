'use client'

import { useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import GameShowcase from '@/components/GameShowcase'
import Stats from '@/components/Stats'
import Footer from '@/components/Footer'
import CustomCursor from '@/components/CustomCursor'
import AIChatBot from '@/components/AIChatBot'

export default function Home() {
  return (
    <main>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Features />
      <GameShowcase />
      <Stats />
      <Footer />
      <AIChatBot />
    </main>
  )
}
