'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AIChatBot.module.css'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '🎮 Welcome to NEXUS Gaming! I\'m your AI tactical assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageIdRef = useRef(2)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on keywords
    const lowerMsg = userMessage.toLowerCase()

    if (lowerMsg.includes('game') || lowerMsg.includes('play')) {
      return '🎯 We have 3 epic games: Cyber Legends (Battle Royale), Stellar Warfare (Space Combat), and Shadow Realm (Action RPG). Which one interests you?'
    } else if (lowerMsg.includes('feature')) {
      return '⚡ NEXUS offers Cross-Platform Play, Real-time Stats Tracking, and 24/7 Support. Check out our Features section for more!'
    } else if (lowerMsg.includes('price') || lowerMsg.includes('cost')) {
      return '💰 Join our platform for free! Premium features unlock at competitive rates. Contact us for enterprise solutions.'
    } else if (lowerMsg.includes('help') || lowerMsg.includes('support')) {
      return '🛡️ Our 24/7 tactical support team is ready to assist. You can reach us via the contact form or join our Discord community!'
    } else if (lowerMsg.includes('stats') || lowerMsg.includes('player')) {
      return '📊 We have 10M+ active operatives, 98.7% win rate, and 500K+ completed missions. Join the elite!'
    } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
      return '👋 Greetings, soldier! Ready to dominate the battlefield? Ask me anything about NEXUS Gaming!'
    } else {
      return '🎮 Interesting question! I can help you with: Games, Features, Pricing, Support, and Stats. What would you like to know?'
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messageIdRef.current++,
      text: input,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(async () => {
      const response = await generateResponse(input)
      const botMessage: Message = {
        id: messageIdRef.current++,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        {isOpen ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.chatWindow}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className={styles.chatHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.statusDot} />
                <div>
                  <div className={styles.headerTitle}>AI TACTICAL ASSISTANT</div>
                  <div className={styles.headerSubtitle}>Powered by 21st.dev</div>
                </div>
              </div>
              <div className={styles.headerRight}>ONLINE</div>
            </div>

            {/* Messages */}
            <div className={styles.chatMessages}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                  initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.messageContent}>
                    {message.text}
                  </div>
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className={`${styles.message} ${styles.botMessage}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={styles.chatInput}>
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
              />
              <motion.button
                onClick={handleSend}
                className={styles.sendButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!input.trim()}
              >
                ▶
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
