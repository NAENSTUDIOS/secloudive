import type { AcademyModule, ScenarioAction, ScenarioState, QuizQuestion, QuizResult } from '../types';

export function unmetPrerequisites(module: Pick<AcademyModule, 'prerequisites'>, completedModuleIds: Iterable<string>): string[] {
  const completed = new Set(completedModuleIds);
  return module.prerequisites.filter((id) => !completed.has(id));
}

export function isModuleAvailable(module: Pick<AcademyModule, 'prerequisites'>, completedModuleIds: Iterable<string>): boolean {
  return unmetPrerequisites(module, completedModuleIds).length === 0;
}

export function academyCompletion(modules: Pick<AcademyModule, 'id'>[], completedModuleIds: Iterable<string>): { completed: number; total: number; percentage: number; complete: boolean } {
  const completed = new Set(completedModuleIds);
  const count = modules.filter((module) => completed.has(module.id)).length;
  const total = modules.length;
  return { completed: count, total, percentage: total ? Math.round((count / total) * 100) : 0, complete: total > 0 && count === total };
}

export function scoreQuiz(questions: QuizQuestion[], answers: Record<number, number> | number[], passPercentage = 70): QuizResult {
  const results = questions.map((question, index) => answers[index] === question.answerIndex);
  const correct = results.filter(Boolean).length;
  const percentage = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  return { correct, total: questions.length, percentage, passed: questions.length > 0 && percentage >= passPercentage, results };
}

export const initialScenarioState: ScenarioState = { status: 'idle', currentStep: 0, completedSteps: [], answers: {}, result: null };

export function scenarioReducer(state: ScenarioState, action: ScenarioAction): ScenarioState {
  switch (action.type) {
    case 'start': return { ...initialScenarioState, status: 'in-progress' };
    case 'answer': return { ...state, answers: { ...state.answers, [action.questionId]: action.answer } };
    case 'complete-step': return { ...state, completedSteps: state.completedSteps.includes(action.step) ? state.completedSteps : [...state.completedSteps, action.step] };
    case 'next-step': return { ...state, currentStep: state.currentStep + 1 };
    case 'finish': return { ...state, status: 'completed', result: action.result };
    case 'reset': return initialScenarioState;
  }
}
