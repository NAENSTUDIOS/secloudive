export type PlatformRole =
  | 'learner'
  | 'instructor'
  | 'reviewer'
  | 'support'
  | 'content_author'
  | 'technical_reviewer'
  | 'security_reviewer'
  | 'organization_manager'
  | 'billing_administrator'
  | 'platform_administrator'
  | 'security_administrator'
  | 'platform_owner';

export type Permission =
  | 'profile:read'
  | 'profile:update'
  | 'content:read'
  | 'content:write'
  | 'content:publish'
  | 'progress:read:self'
  | 'progress:read:assigned'
  | 'progress:write:self'
  | 'assessment:submit'
  | 'assessment:review'
  | 'admin:read'
  | 'admin:write'
  | 'security:read'
  | 'security:write';

const rolePermissions: Readonly<Record<PlatformRole, readonly Permission[]>> = {
  learner: [
    'profile:read',
    'profile:update',
    'content:read',
    'progress:read:self',
    'progress:write:self',
    'assessment:submit',
  ],
  instructor: ['profile:read', 'content:read', 'progress:read:assigned', 'assessment:review'],
  reviewer: ['profile:read', 'content:read', 'assessment:review'],
  support: ['profile:read'],
  content_author: ['content:read', 'content:write'],
  technical_reviewer: ['content:read', 'content:write'],
  security_reviewer: ['content:read', 'security:read'],
  organization_manager: ['profile:read', 'content:read', 'progress:read:assigned'],
  billing_administrator: ['profile:read'],
  platform_administrator: [
    'profile:read',
    'content:read',
    'content:write',
    'content:publish',
    'admin:read',
    'admin:write',
  ],
  security_administrator: ['profile:read', 'security:read', 'security:write'],
  platform_owner: [
    'profile:read',
    'profile:update',
    'content:read',
    'content:write',
    'content:publish',
    'progress:read:self',
    'progress:read:assigned',
    'progress:write:self',
    'assessment:submit',
    'assessment:review',
    'admin:read',
    'admin:write',
    'security:read',
    'security:write',
  ],
};

export function hasPermission(roles: readonly PlatformRole[], permission: Permission): boolean {
  return roles.some((role) => rolePermissions[role].includes(permission));
}
