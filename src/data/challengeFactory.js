export function buildChallenge({ id, title, difficulty, question, codeSnippet, options, correctAnswer, riskLevel, explanation, remediation, whyThisMatters, realWorldImpact, type = 'Security scenario', points = 100 }) {
  return {
    id, title, difficulty, question, codeSnippet, options, correctAnswer, riskLevel,
    explanation, remediation, whyThisMatters, realWorldImpact, type, points,
    time: difficulty === 'Advanced' ? '18 min' : difficulty === 'Intermediate' ? '12 min' : '8 min',
    description: question, tags: [type, riskLevel], status: 'active',
  }
}
