export type AppRole = 'admin' | 'user';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: AppRole;
  is_admin?: boolean | null;
  avatar_url: string | null;
};

export type LearningPath = {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: 'foundation' | 'intermediate' | 'advanced';
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SecurityResource = {
  id: string;
  path_id: string | null;
  slug: string;
  title: string;
  summary: string;
  category: string;
  resource_type: 'lesson' | 'lab' | 'assessment' | 'reference';
  level: 'foundation' | 'intermediate' | 'advanced';
  duration_minutes: number;
  content: Array<{ heading?: string; body: string; code?: string }>;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AcademyTrack = 'core' | 'aws' | 'azure' | 'gcp';
export type AcademyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AcademyPath = {
  id: string;
  slug: string;
  track: AcademyTrack;
  level: AcademyLevel;
  title: string;
  description: string;
  moduleIds: string[];
  published: boolean;
};
export type AcademyModule = {
  id: string;
  track: AcademyTrack;
  level: AcademyLevel;
  title: string;
  summary: string;
  estimatedMinutes: number;
  prerequisites: string[];
};
export type QuizQuestion = { question: string; options: string[]; answerIndex: number; explanation: string };
export type ModuleDetail = AcademyModule & { body: string; keyConcepts: string[]; quiz: QuizQuestion[]; resourceIds: string[]; labId: string | null };
export type Scenario = { id: string; title: string; role: string; level: AcademyLevel; summary: string; durationMinutes: number };
export type Lab = { id: string; provider: string; title: string; emulator: string; steps: string[]; teardown: string[]; costWarning: string };
export type AcademyResource = { id: string; title: string; url: string; provider: string; track: AcademyTrack; level: AcademyLevel; type: 'video' | 'doc' | 'lab' | 'course' | 'book'; isFree: boolean; summary: string };

export type QuizResult = {
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  results: boolean[];
};

export type ScenarioState = {
  status: 'idle' | 'in-progress' | 'completed';
  currentStep: number;
  completedSteps: number[];
  answers: Record<string, string>;
  result: 'success' | 'failure' | null;
};

export type ScenarioAction =
  | { type: 'start' }
  | { type: 'answer'; questionId: string; answer: string }
  | { type: 'complete-step'; step: number }
  | { type: 'next-step' }
  | { type: 'finish'; result: 'success' | 'failure' }
  | { type: 'reset' };
