import { describe, expect, it } from 'vitest';
import type { ContentItem } from './index.js';
import { isPublishableContent } from './index.js';

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
