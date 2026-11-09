import { useState } from 'react';
import type { QuizQuestion } from '../../types';

export function QuizCard({ questions, onPass }: { questions: QuizQuestion[]; onPass: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = questions.length ? Math.round((questions.filter((question, index) => answers[index] === question.answerIndex).length / questions.length) * 100) : 0;
  return <section className="panel space-y-6"><div><p className="eyebrow">Knowledge check</p><h2 className="text-xl font-semibold">Prove your understanding</h2></div>{questions.map((question, index) => <fieldset key={question.question} className="space-y-3"><legend className="font-medium">{index + 1}. {question.question}</legend>{question.options.map((option, optionIndex) => <label className={`choice ${submitted && optionIndex === question.answerIndex ? 'choice-correct' : ''}`} key={option}><input type="radio" name={`question-${index}`} checked={answers[index] === optionIndex} onChange={() => setAnswers({ ...answers, [index]: optionIndex })} />{option}</label>)}{submitted && <p className="text-sm text-slate-400">{question.explanation}</p>}</fieldset>)}<div className="flex flex-wrap items-center gap-4"><button className="button-primary" onClick={() => { setSubmitted(true); onPass(score); }}>{submitted ? 'Recalculate score' : 'Check answers'}</button>{submitted && <span className={score >= 70 ? 'success' : 'error'}>{score}% — {score >= 70 ? 'Module unlocked' : 'Score 70% or higher to complete this module.'}</span>}</div></section>;
}
