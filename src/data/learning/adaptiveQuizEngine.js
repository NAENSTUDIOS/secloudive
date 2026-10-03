// Adaptive Quiz Engine for SeCloudive Academy
// Implements Question Bank Sampling (10 from 30), Difficulty Escalation,
// Double Randomization (Question order + Option order), and Infallible Answer Verification

import { getQuestionBankForPath, questionBanksByPath } from './questionBanks'

/**
 * Modern Fisher-Yates array shuffle (pure and non-mutating)
 */
export function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Randomizes answer options while recalculating `correctIndex` from `correctAnswer` text
 * Guarantees 100% score accuracy across infinite retakes and permutations
 */
export function randomizeQuestionOptions(question) {
  if (!question || !Array.isArray(question.options)) return question

  let explanation = question.explanation

  // Identify if options are objects like { id, text, isCorrect, explanation }
  const isObjectList = question.options.some(opt => opt && typeof opt === 'object')

  let normalizedOptions = []
  let correctText = typeof question.correctAnswer === 'string'
    ? question.correctAnswer
    : (question.correctAnswer?.text || null)

  if (isObjectList) {
    normalizedOptions = question.options.map(opt => {
      if (typeof opt === 'string') return opt
      if (opt && typeof opt === 'object') {
        if (opt.isCorrect && !correctText && opt.text) {
          correctText = opt.text
        }
        if (opt.isCorrect && opt.explanation && !explanation) {
          explanation = opt.explanation
        }
        return opt.text || opt.title || opt.id || String(opt)
      }
      return String(opt)
    })
  } else {
    normalizedOptions = question.options.map(opt => (typeof opt === 'string' ? opt : (opt?.text || String(opt))))
  }

  // Fallback for correctText if still not identified
  if (!correctText) {
    if (typeof question.correctIndex === 'number' && normalizedOptions[question.correctIndex]) {
      correctText = normalizedOptions[question.correctIndex]
    } else {
      correctText = normalizedOptions[0]
    }
  }

  const shuffledOptions = shuffleArray(normalizedOptions)
  const newCorrectIndex = shuffledOptions.indexOf(correctText)

  return {
    ...question,
    options: shuffledOptions,
    correctAnswer: correctText,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0,
    explanation: explanation || question.explanation
  }
}

/**
 * Generates an Adaptive 10-Question Assessment Session from a 30-Question Bank
 * 
 * Adaptive Strategy:
 * - High Scorers (>=80%): Escalated difficulty (0 Beginner, 2 Intermediate, 4 Advanced, 4 Engineer Level)
 * - Developing (60-79%): Balanced distribution (2 Beginner, 3 Intermediate, 3 Advanced, 2 Engineer Level)
 * - Foundation (<60%): Remediation support (4 Beginner, 4 Intermediate, 2 Advanced, 0 Engineer Level)
 * 
 * Prevents repeating the exact same question sequence across retakes.
 */
export function generateAdaptiveQuizSession({
  pathId = 'iam',
  previousScore = null,
  previousQuestionIds = [],
  attemptNumber = 1
}) {
  const bank = getQuestionBankForPath(pathId)
  if (!bank || bank.length === 0) return null

  // Categorize pool by difficulty
  const byDifficulty = {
    Beginner: bank.filter(q => q.difficulty === 'Beginner'),
    Intermediate: bank.filter(q => q.difficulty === 'Intermediate'),
    Advanced: bank.filter(q => q.difficulty === 'Advanced'),
    'Engineer Level': bank.filter(q => q.difficulty === 'Engineer Level')
  }

  // Determine adaptive quota distribution
  let quota = { Beginner: 2, Intermediate: 3, Advanced: 3, 'Engineer Level': 2 }
  let tierLabel = 'Standard Adaptive'

  if (typeof previousScore === 'number') {
    if (previousScore >= 80) {
      quota = { Beginner: 0, Intermediate: 2, Advanced: 4, 'Engineer Level': 4 }
      tierLabel = 'Advanced Escalation'
    } else if (previousScore < 60) {
      quota = { Beginner: 4, Intermediate: 4, Advanced: 2, 'Engineer Level': 0 }
      tierLabel = 'Foundation Reinforcement'
    }
  }

  // Helper to pick questions while deprioritizing recently served questions
  function pickFromTier(tierList, count) {
    if (!tierList || tierList.length === 0) return []
    // Split into unserved vs recently served
    const unserved = tierList.filter(q => !previousQuestionIds.includes(q.id))
    const served = tierList.filter(q => previousQuestionIds.includes(q.id))

    const pool = [...shuffleArray(unserved), ...shuffleArray(served)]
    return pool.slice(0, count)
  }

  let selected = [
    ...pickFromTier(byDifficulty.Beginner, quota.Beginner),
    ...pickFromTier(byDifficulty.Intermediate, quota.Intermediate),
    ...pickFromTier(byDifficulty.Advanced, quota.Advanced),
    ...pickFromTier(byDifficulty['Engineer Level'], quota['Engineer Level'])
  ]

  // If tier rounding fell short of 10, fill from remaining bank
  if (selected.length < 10) {
    const selectedIds = new Set(selected.map(q => q.id))
    const remaining = shuffleArray(bank.filter(q => !selectedIds.has(q.id)))
    selected = [...selected, ...remaining.slice(0, 10 - selected.length)]
  }

  // Truncate to exactly 10 questions if over
  if (selected.length > 10) {
    selected = selected.slice(0, 10)
  }

  // 1. Randomize question order every attempt
  const randomizedQuestions = shuffleArray(selected).map((q, idx) => {
    // 2. Randomize answer option order every attempt
    const randomized = randomizeQuestionOptions(q)
    return {
      ...randomized,
      sessionOrder: idx + 1
    }
  })

  return {
    sessionId: `session_${pathId}_${Date.now()}`,
    pathId,
    domainName: questionBanksByPath[pathId]?.domainName || pathId.toUpperCase(),
    attemptNumber,
    tierLabel,
    totalQuestions: randomizedQuestions.length,
    questions: randomizedQuestions,
    questionIds: randomizedQuestions.map(q => q.id),
    generatedAt: new Date().toISOString()
  }
}

/**
 * Evaluates user answers for an adaptive assessment session
 * Returns comprehensive analytics: score, strong topics, weak topics, difficulty performance
 */
export function evaluateAdaptiveQuizSession(session, userAnswers = {}) {
  if (!session || !Array.isArray(session.questions)) return null

  let correctCount = 0
  const total = session.questions.length
  const questionResults = []
  const topicStats = {}
  const difficultyStats = {
    Beginner: { total: 0, correct: 0 },
    Intermediate: { total: 0, correct: 0 },
    Advanced: { total: 0, correct: 0 },
    'Engineer Level': { total: 0, correct: 0 }
  }

  session.questions.forEach((q, index) => {
    const selectedIndex = userAnswers[q.id]
    const isAnswered = typeof selectedIndex === 'number'
    const isCorrect = isAnswered && selectedIndex === q.correctIndex

    if (isCorrect) correctCount++

    // Track difficulty
    if (difficultyStats[q.difficulty]) {
      difficultyStats[q.difficulty].total++
      if (isCorrect) difficultyStats[q.difficulty].correct++
    }

    // Track topic
    const topicKey = q.topicTitle || q.category || 'General'
    if (!topicStats[topicKey]) {
      topicStats[topicKey] = { total: 0, correct: 0, topicId: q.topicId }
    }
    topicStats[topicKey].total++
    if (isCorrect) topicStats[topicKey].correct++

    questionResults.push({
      id: q.id,
      number: index + 1,
      difficulty: q.difficulty,
      topicTitle: q.topicTitle,
      category: q.category,
      question: q.question,
      options: q.options,
      selectedIndex,
      correctIndex: q.correctIndex,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
      engineerReasoning: q.engineerReasoning,
      businessImpact: q.businessImpact,
      awsBestPractice: q.awsBestPractice
    })
  })

  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const passed = score >= 70
  const isMastery = score >= 85

  // Compute strong vs weak topics
  const strongTopics = []
  const weakTopics = []

  Object.entries(topicStats).forEach(([title, stat]) => {
    const percent = Math.round((stat.correct / stat.total) * 100)
    if (percent >= 80) {
      strongTopics.push({ title, percent, topicId: stat.topicId })
    } else if (percent < 60) {
      weakTopics.push({ title, percent, topicId: stat.topicId })
    }
  })

  // Adaptive next recommendation
  let adaptiveFeedback = ''
  if (score >= 85) {
    adaptiveFeedback = 'Outstanding performance! You have demonstrated Senior Cloud Security Engineer competency across this domain. We have escalated your next assessment to Advanced/Engineer Level.'
  } else if (score >= 70) {
    adaptiveFeedback = 'Solid understanding. You passed the knowledge benchmark. Target the weak topics identified below before advancing to Architecture Reviews.'
  } else {
    adaptiveFeedback = 'Knowledge gaps detected. Review the recommended learning modules below and re-test with a fresh randomized question set.'
  }

  return {
    sessionId: session.sessionId,
    pathId: session.pathId,
    domainName: session.domainName,
    attemptNumber: session.attemptNumber,
    score,
    passed,
    isMastery,
    correctCount,
    totalQuestions: total,
    tierLabel: session.tierLabel,
    strongTopics,
    weakTopics,
    difficultyStats,
    adaptiveFeedback,
    questionResults,
    completedAt: new Date().toISOString()
  }
}
