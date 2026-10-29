export type ContentStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'deprecated'
  | 'archived'
  | 'withdrawn';

export type ContentProvenance = {
  sourceUrl?: string;
  sourceTitle?: string;
  publisher?: string;
  license?: string;
  attributionRequired: boolean;
  originalityNotes: string;
  reviewedAt?: string;
};

export type ContentItem = {
  id: string;
  title: string;
  contentType: 'article' | 'lesson' | 'exercise' | 'mission' | 'assessment';
  status: ContentStatus;
  version: number;
  objectives: string[];
  prerequisites: string[];
  provenance: ContentProvenance;
  owner: string;
  nextReviewAt?: string;
};

export type FoundationDomain =
  | 'computer_fundamentals'
  | 'linux'
  | 'networking'
  | 'git_github'
  | 'python'
  | 'docker'
  | 'ci_cd'
  | 'security_fundamentals';

export type LearningObjective = {
  id: string;
  statement: string;
  assessmentMethod: 'knowledge_check' | 'practice' | 'reflection' | 'mission';
};

export type FoundationModule = ContentItem & {
  contentType: 'article' | 'lesson' | 'exercise';
  domain: FoundationDomain;
  estimatedMinutes: number;
  learningObjectives: readonly LearningObjective[];
  relatedAwsConcepts: readonly string[];
  relatedRoles: readonly string[];
  body: readonly {
    type: 'heading' | 'paragraph' | 'callout' | 'code';
    value: string;
  }[];
};

export function isPublishableContent(item: ContentItem): boolean {
  return item.status === 'approved' || item.status === 'scheduled' || item.status === 'published';
}

// ── Assessment / knowledge-check schema ─────────────────────────────────────

export type QuestionType = 'single_choice' | 'multi_choice' | 'true_false';

export type AnswerOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  type: QuestionType;
  stem: string;
  options: readonly AnswerOption[];
  correctOptionIds: readonly string[];
  explanation: string;
  objectiveId: string;
};

export type KnowledgeCheck = {
  id: string;
  moduleId: string;
  passingScorePct: number;
  questions: readonly Question[];
};

export type SubmittedAnswer = {
  questionId: string;
  selectedOptionIds: readonly string[];
};

export type QuestionResult = {
  questionId: string;
  correct: boolean;
  correctOptionIds: readonly string[];
  explanation: string;
};

export type AssessmentResult = {
  submissionId: string;
  contentId: string;
  attemptNumber: number;
  scorePct: number;
  passed: boolean;
  results: readonly QuestionResult[];
};

export function evaluateKnowledgeCheck(
  check: KnowledgeCheck,
  answers: readonly SubmittedAnswer[],
  submissionId: string,
  attemptNumber: number,
): AssessmentResult {
  if (check.passingScorePct < 0 || check.passingScorePct > 100) {
    throw new Error('passingScorePct must be between 0 and 100');
  }

  const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedOptionIds]));

  const results: QuestionResult[] = check.questions.map((q) => {
    const selected = answerMap.get(q.id) ?? [];
    const correct =
      selected.length === q.correctOptionIds.length &&
      q.correctOptionIds.every((id) => selected.includes(id));
    return { questionId: q.id, correct, correctOptionIds: q.correctOptionIds, explanation: q.explanation };
  });

  const correctCount = results.filter((r) => r.correct).length;
  const scorePct = check.questions.length === 0
    ? 0
    : Math.round((correctCount / check.questions.length) * 100);

  return {
    submissionId,
    contentId: check.moduleId,
    attemptNumber,
    scorePct,
    passed: scorePct >= check.passingScorePct,
    results,
  };
}
