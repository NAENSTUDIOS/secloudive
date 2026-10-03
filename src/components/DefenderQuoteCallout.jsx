import React, { useState, useEffect, useMemo } from 'react'
import { Quote, RefreshCw, Check, Copy, Sparkles } from 'lucide-react'
import { MOTIVATIONAL_QUOTES } from './PlatformExplorationRoadmap'
import { playTactileClick } from '../utils/cyberMotionAudio'
import '../styles/encouragingQuote.css'

export default function DefenderQuoteCallout({ 
  quoteId = null, 
  category = 'general', 
  autoCycle = false, 
  cycleIntervalMs = 12000,
  className = '' 
}) {
  const quotePool = useMemo(() => {
    if (quoteId !== null) {
      const found = MOTIVATIONAL_QUOTES.find(q => q.id === quoteId)
      return found ? [found] : MOTIVATIONAL_QUOTES
    }
    if (category && category !== 'all') {
      const filtered = MOTIVATIONAL_QUOTES.filter(q => q.category === category)
      return filtered.length > 0 ? filtered : MOTIVATIONAL_QUOTES
    }
    return MOTIVATIONAL_QUOTES
  }, [quoteId, category])

  // Random initial index within pool
  const [poolIndex, setPoolIndex] = useState(() => {
    return Math.floor(Math.random() * quotePool.length)
  })
  const [copied, setCopied] = useState(false)
  const [isFading, setIsFading] = useState(false)

  // Ensure index stays in bounds if pool changes
  const activeQuote = quotePool[poolIndex % quotePool.length] || quotePool[0]

  // Optional auto-cycle transition
  useEffect(() => {
    if (!autoCycle || quotePool.length <= 1) return

    const timer = setInterval(() => {
      handleNextQuote()
    }, cycleIntervalMs)

    return () => clearInterval(timer)
  }, [autoCycle, cycleIntervalMs, poolIndex, quotePool.length])

  const handleNextQuote = () => {
    if (quotePool.length <= 1) return
    setIsFading(true)
    setTimeout(() => {
      setPoolIndex(prev => (prev + 1) % quotePool.length)
      setIsFading(false)
    }, 180)
  }

  const handleCopyQuote = () => {
    playTactileClick()
    const textToCopy = `"${activeQuote.quote}" — ${activeQuote.author} (${activeQuote.role})`
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <aside 
      className={`defender-quote-callout theme-${category} ${className}`}
      aria-label="Security Defender Motivational Wisdom"
    >
      <div className="quote-left-wrapper">
        <div className="quote-avatar-initials" title={activeQuote.author}>
          {activeQuote.initials || 'SE'}
        </div>
        <div className={`quote-text-container ${isFading ? '' : 'quote-fade-in'}`}>
          <blockquote className="quote-body-text">
            “{activeQuote.quote}”
          </blockquote>
          <div className="quote-meta-row">
            <span className="quote-author-name">{activeQuote.author}</span>
            <span className="quote-author-role">• {activeQuote.role}</span>
            {activeQuote.theme && (
              <span className="quote-theme-pill">{activeQuote.theme}</span>
            )}
          </div>
        </div>
      </div>

      <div className="quote-action-buttons">
        <button 
          type="button" 
          onClick={handleCopyQuote}
          className="quote-tool-btn"
          title="Copy Quote for LinkedIn / Notes"
        >
          {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
        </button>

        {quoteId === null && (
          <button 
            type="button" 
            onClick={() => {
              playTactileClick()
              handleNextQuote()
            }}
            className="quote-tool-btn"
            title="Next Inspirational Maxim"
          >
            <RefreshCw size={13} />
          </button>
        )}
      </div>
    </aside>
  )
}
