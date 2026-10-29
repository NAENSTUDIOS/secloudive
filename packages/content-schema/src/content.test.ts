import { describe, expect, it } from 'vitest';
import type { ContentItem, KnowledgeCheck, SubmittedAnswer } from './index.js';
import { evaluateKnowledgeCheck, isPublishableContent } from './index.js';

const item: ContentItem = {
  id: 'example',
  title: 'Example',
  contentType: 'lesson',
  status: 'draft',
  version: 1,
  objectives: ['Explain the concept'],
  prerequisites: [],
  provenance: {
    attributionRequired: false,
    originalityNotes: 'Original test content.',
  },
  owner: 'test',
};

describe('content publication rules', () => {
  it('does not publish drafts', () => {
    expect(isPublishableContent(item)).toBe(false);
  });

  it('recognizes approved content as eligible for publication workflow', () => {
    expect(isPublishableContent({ ...item, status: 'approved' })).toBe(true);
  });
});

const check: KnowledgeCheck = {
  id: 'check-linux-1',
  moduleId: 'foundation-linux-permissions',
  passingScorePct: 80,
  questions: [
    {
      id: 'q1',
      type: 'single_choice',
      stem: 'Which permission bit allows a file to be executed?',
      options: [
        { id: 'a', text: 'Read (r)' },
        { id: 'b', text: 'Write (w)' },
        { id: 'c', text: 'Execute (x)' },
      ],
      correctOptionIds: ['c'],
      explanation: 'The execute bit (x) allows a file to be run as a program.',
      objectiveId: 'linux-permissions-explain',
    },
    {
      id: 'q2',
      type: 'true_false',
      stem: 'chmod 777 follows the principle of least privilege.',
      options: [
        { id: 'true', text: 'True' },
        { id: 'false', text: 'False' },
      ],
      correctOptionIds: ['false'],
      explanation: 'chmod 777 grants full access to everyone, violating least privilege.',
      objectiveId: 'linux-permissions-reason',
    },
  ],
};

describe('knowledge check evaluation', () => {
  it('passes when all answers are correct', () => {
    const answers: SubmittedAnswer[] = [
      { questionId: 'q1', selectedOptionIds: ['c'] },
      { questionId: 'q2', selectedOptionIds: ['false'] },
    ];
    const result = evaluateKnowledgeCheck(check, answers, 'sub-1', 1);
    expect(result.scorePct).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.results.every((r) => r.correct)).toBe(true);
  });

  it('fails when score is below passing threshold', () => {
    const answers: SubmittedAnswer[] = [
      { questionId: 'q1', selectedOptionIds: ['a'] },
      { questionId: 'q2', selectedOptionIds: ['false'] },
    ];
    const result = evaluateKnowledgeCheck(check, answers, 'sub-2', 1);
    expect(result.scorePct).toBe(50);
    expect(result.passed).toBe(false);
  });

  it('treats unanswered questions as incorrect', () => {
    const result = evaluateKnowledgeCheck(check, [], 'sub-3', 1);
    expect(result.scorePct).toBe(0);
    expect(result.passed).toBe(false);
  });

  it('rejects an invalid passing score', () => {
    expect(() =>
      evaluateKnowledgeCheck({ ...check, passingScorePct: 110 }, [], 'sub-4', 1),
    ).toThrow('passingScorePct must be between 0 and 100');
  });
});
