/**
 * Decide whether cloud progress should hydrate the current local profile.
 *
 * The local store always contains the progress schema, even for a new learner,
 * so object-key presence is not evidence of meaningful local activity.
 */
export function hasMeaningfulProgress(progress) {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) return false

  return Object.entries(progress).some(([key, value]) => {
    if (key === 'targetCareerRole') return value && value !== 'Cloud Security Engineer'
    if (Array.isArray(value)) return value.length > 0
    if (value && typeof value === 'object') return Object.keys(value).length > 0
    return Boolean(value)
  })
}

export function shouldHydrateCloudProgress(localProgress, cloudProgress) {
  return Boolean(
    cloudProgress &&
    typeof cloudProgress === 'object' &&
    !Array.isArray(cloudProgress) &&
    Object.keys(cloudProgress).length > 0 &&
    !hasMeaningfulProgress(localProgress)
  )
}
