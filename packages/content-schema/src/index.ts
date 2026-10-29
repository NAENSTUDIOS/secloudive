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
