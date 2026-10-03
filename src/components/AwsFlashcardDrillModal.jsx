// =========================================================================
// SeCloudive - AWS Certification Flashcards & Spaced-Repetition Drills
// Interactive 3D Flip-Card Trainer for SCS-C02 & SAA-C03
// =========================================================================

import { useState, useEffect, useMemo } from 'react'
import {
  Award,
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  Shuffle,
  X,
  Zap,
  Lightbulb,
  Check
} from 'lucide-react'
import { FLASHCARD_DECKS } from '../data/awsCertificationFlashcards'
import { playTactileClick } from '../utils/cyberMotionAudio'
import { useChallenges } from '../context/ChallengeContext'

export default function AwsFlashcardDrillModal() {
  const { activeProfile } = useChallenges() || {}
  const userId = activeProfile?.id || 'guest'
  const flashcardStorageKey = `secloudive_flashcards_${userId}`

  const [isOpen, setIsOpen] = useState(false)
  const [activeDeckId, setActiveDeckId] = useState('scs-c02')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Track mastered and review cards in localStorage
  const loadStatsForUser = () => {
    try {
      const saved = localStorage.getItem(flashcardStorageKey) || (userId === 'guest' ? localStorage.getItem('secloudive_flashcard_stats') : null)
      if (saved) return JSON.parse(saved)
    } catch (e) {
      console.warn('Could not parse flashcard stats', e)
    }
    return {
      mastered: [],
      needsReview: []
    }
  }

  const [cardStats, setCardStats] = useState(loadStatsForUser)

  // Reload stats whenever active user profile changes
  useEffect(() => {
    setCardStats(loadStatsForUser())
  }, [userId])

  // Global listener to open flashcards
  useEffect(() => {
    const handleOpen = (e) => {
      if (e?.detail?.deckId) {
        setActiveDeckId(e.detail.deckId)
      }
      setIsOpen(true)
      setIsFlipped(false)
    }
    window.addEventListener('open-flashcards', handleOpen)
    return () => window.removeEventListener('open-flashcards', handleOpen)
  }, [])

  const activeDeck = useMemo(() => {
    return FLASHCARD_DECKS.find(d => d.id === activeDeckId) || FLASHCARD_DECKS[0]
  }, [activeDeckId])

  const cards = activeDeck.cards || []
  const currentCard = cards[currentCardIndex] || cards[0]

  // Reset card state when deck changes
  const handleSelectDeck = (deckId) => {
    playTactileClick()
    setActiveDeckId(deckId)
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }

  // Flip card
  const handleFlip = () => {
    playTactileClick()
    setIsFlipped(prev => !prev)
  }

  // Next / Prev card
  const handleNext = () => {
    playTactileClick()
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev + 1) % cards.length)
  }

  const handlePrev = () => {
    playTactileClick()
    setIsFlipped(false)
    setCurrentCardIndex(prev => (prev - 1 + cards.length) % cards.length)
  }

  // Shuffle deck
  const handleShuffle = () => {
    playTactileClick()
    setIsFlipped(false)
    setCurrentCardIndex(Math.floor(Math.random() * cards.length))
  }

  // Spaced-repetition ratings
  const handleRateCard = (rating) => {
    playTactileClick()
    const cardId = currentCard.id
    setCardStats(prev => {
      const isMastered = rating === 'easy'
      const updated = {
        mastered: isMastered ? [...new Set([...prev.mastered, cardId])] : prev.mastered.filter(id => id !== cardId),
        needsReview: !isMastered ? [...new Set([...prev.needsReview, cardId])] : prev.needsReview.filter(id => id !== cardId)
      }
      localStorage.setItem(flashcardStorageKey, JSON.stringify(updated))
      return updated
    })
    handleNext()
  }

  const isCurrentMastered = cardStats.mastered?.includes(currentCard.id)
  const isCurrentNeedsReview = cardStats.needsReview?.includes(currentCard.id)

  if (!isOpen) return null

  return (
    <div className="flashcard-modal-backdrop" onClick={() => setIsOpen(false)}>
      <div 
        className="flashcard-modal-dialog" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="AWS Certification Flashcard Drills"
      >
        {/* Top Header */}
        <div className="flashcard-top-bar">
          <div className="flashcard-title-box">
            <Award size={18} className="text-amber" />
            <div>
              <h2 className="modal-title">AWS Certification Flashcards & Drills</h2>
              <span className="modal-subtitle">Spaced-repetition mastery for SCS-C02 & SAA-C03</span>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-modal-close" 
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Deck Selector Tabs */}
        <div className="flashcard-deck-tabs" role="tablist">
          {FLASHCARD_DECKS.map(deck => {
            const isSelected = deck.id === activeDeckId
            return (
              <button
                key={deck.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={`deck-tab-btn \${isSelected ? 'is-active' : ''}`}
                onClick={() => handleSelectDeck(deck.id)}
                style={{ borderColor: isSelected ? (deck.color || '#38bdf8') : undefined }}
              >
                <span className="deck-code" style={{ color: deck.color || '#38bdf8' }}>{deck.code}</span>
                <span className="deck-name">{deck.name}</span>
              </button>
            )
          })}
        </div>

        {/* Deck Description & Progress Tracker */}
        <div className="deck-meta-bar">
          <div className="deck-info-left">
            <span className="deck-badge-pill" style={{ color: activeDeck.color, borderColor: activeDeck.color }}>
              {activeDeck.badge}
            </span>
            <span className="deck-counter">Card {currentCardIndex + 1} of {cards.length}</span>
          </div>

          <div className="deck-actions-right">
            <button type="button" className="btn-deck-tool" onClick={handleShuffle} title="Shuffle Deck">
              <Shuffle size={14} />
              <span>Shuffle</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flashcard-progress-track">
          <div 
            className="flashcard-progress-fill" 
            style={{ 
              width: `\${((currentCardIndex + 1) / cards.length) * 100}%`,
              background: activeDeck.color || '#38bdf8'
            }} 
          />
        </div>

        {/* 3D Flip Card Container */}
        <div className="flashcard-scene" onClick={handleFlip}>
          <div className={`flashcard-card-3d \${isFlipped ? 'is-flipped' : ''}`}>
            
            {/* FRONT FACE (Question) */}
            <div className="flashcard-face flashcard-front">
              <div className="card-face-header">
                <span className="card-category-pill">
                  <BookOpen size={12} /> {currentCard.category}
                </span>
                <span className="card-flip-prompt">
                  <RotateCw size={12} /> Click to reveal answer
                </span>
              </div>

              <div className="card-question-content">
                <p className="question-text">{currentCard.question}</p>
              </div>

              <div className="card-face-footer">
                <div className="card-status-tags">
                  {isCurrentMastered && (
                    <span className="status-tag mastered">
                      <Check size={11} /> Mastered
                    </span>
                  )}
                  {isCurrentNeedsReview && (
                    <span className="status-tag review">
                      <HelpCircle size={11} /> Review Needed
                    </span>
                  )}
                </div>
                <button type="button" className="btn-flip-hint">
                  Reveal Answer &rarr;
                </button>
              </div>
            </div>

            {/* BACK FACE (Answer, Exam Tip, Citation) */}
            <div className="flashcard-face flashcard-back">
              <div className="card-face-header">
                <span className="card-category-pill" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <CheckCircle2 size={12} /> Verified AWS Answer
                </span>
                <span className="card-flip-prompt">
                  <RotateCw size={12} /> Click to flip back
                </span>
              </div>

              <div className="card-answer-content">
                <div className="answer-text">
                  {currentCard.answer.split('\n').map((line, i) => (
                    <div key={i} className="answer-line">{line}</div>
                  ))}
                </div>

                {currentCard.examTip && (
                  <div className="exam-tip-box">
                    <span className="exam-tip-label">
                      <Zap size={12} className="text-amber" /> EXAM SCENARIO TIP:
                    </span>
                    <p className="exam-tip-text">{currentCard.examTip}</p>
                  </div>
                )}

                {currentCard.reference && (
                  <div className="reference-citation">
                    <Lightbulb size={11} /> {currentCard.reference}
                  </div>
                )}
              </div>

              {/* Spaced-Repetition Rating Actions */}
              <div className="card-face-footer card-back-controls" onClick={e => e.stopPropagation()}>
                <span className="rating-label">How well did you know this?</span>
                <div className="rating-buttons">
                  <button 
                    type="button" 
                    className="btn-rate btn-rate-hard"
                    onClick={() => handleRateCard('hard')}
                  >
                    <XCircle size={14} />
                    <span>Hard</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-rate btn-rate-good"
                    onClick={() => handleRateCard('good')}
                  >
                    <span>Good</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-rate btn-rate-easy"
                    onClick={() => handleRateCard('easy')}
                  >
                    <CheckCircle2 size={14} />
                    <span>Mastered</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="flashcard-nav-bar">
          <button 
            type="button" 
            className="btn-nav-arrow" 
            onClick={handlePrev}
            title="Previous Card"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <button 
            type="button" 
            className="btn-nav-flip"
            onClick={handleFlip}
          >
            <RotateCw size={14} />
            <span>{isFlipped ? 'Flip to Question' : 'Flip to Answer'}</span>
          </button>

          <button 
            type="button" 
            className="btn-nav-arrow" 
            onClick={handleNext}
            title="Next Card"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
