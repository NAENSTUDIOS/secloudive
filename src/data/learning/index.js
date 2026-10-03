import { iamPath } from './iamPath.js'
import { s3Path } from './s3Path.js'
import { networkPath } from './networkPath.js'
import { monitoringPath } from './monitoringPath.js'
import { architecturePath } from './architecturePath.js'
import { incidentResponsePath } from './incidentResponsePath.js'
import { foundationsPath } from './foundationsPath.js'
import { careerPath } from './careerPath.js'

export const learningAcademyPaths = [
  iamPath,
  s3Path,
  networkPath,
  monitoringPath,
  architecturePath,
  incidentResponsePath,
  foundationsPath,
  careerPath
]

export const learningPathsMap = {
  iam: iamPath,
  s3: s3Path,
  network: networkPath,
  monitoring: monitoringPath,
  architecture: architecturePath,
  'incident-response': incidentResponsePath,
  foundations: foundationsPath,
  career: careerPath
}

export function getAllTopics() {
  return learningAcademyPaths.flatMap(path => path.topics)
}

export function getTopicById(pathId, topicId) {
  const path = learningPathsMap[pathId]
  if (!path) return null
  return path.topics.find(t => t.id === topicId) || null
}

export function getNextTopic(currentPathId, currentTopicId) {
  const currentPath = learningPathsMap[currentPathId]
  if (!currentPath) return null
  
  const currentIndex = currentPath.topics.findIndex(t => t.id === currentTopicId)
  if (currentIndex >= 0 && currentIndex < currentPath.topics.length - 1) {
    return {
      path: currentPath,
      topic: currentPath.topics[currentIndex + 1]
    }
  }

  // Cross-path transition to the next path
  const pathIndex = learningAcademyPaths.findIndex(p => p.id === currentPathId)
  if (pathIndex >= 0 && pathIndex < learningAcademyPaths.length - 1) {
    const nextPath = learningAcademyPaths[pathIndex + 1]
    return {
      path: nextPath,
      topic: nextPath.topics[0]
    }
  }

  return null
}

export function getPreviousTopic(currentPathId, currentTopicId) {
  const currentPath = learningPathsMap[currentPathId]
  if (!currentPath) return null
  
  const currentIndex = currentPath.topics.findIndex(t => t.id === currentTopicId)
  if (currentIndex > 0) {
    return {
      path: currentPath,
      topic: currentPath.topics[currentIndex - 1]
    }
  }

  // Cross-path transition to previous path
  const pathIndex = learningAcademyPaths.findIndex(p => p.id === currentPathId)
  if (pathIndex > 0) {
    const prevPath = learningAcademyPaths[pathIndex - 1]
    return {
      path: prevPath,
      topic: prevPath.topics[prevPath.topics.length - 1]
    }
  }

  return null
}

export function getPathStats(pathId, completedTopicIds = []) {
  const path = learningPathsMap[pathId]
  if (!path) return { total: 0, completed: 0, percent: 0 }
  
  const total = path.topics.length
  const completed = path.topics.filter(t => completedTopicIds.includes(t.id)).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  
  return { total, completed, percent }
}

export function getOverallAcademyStats(completedTopicIds = []) {
  const allTopics = getAllTopics()
  const total = allTopics.length
  const completed = allTopics.filter(t => completedTopicIds.includes(t.id)).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  return {
    totalTopics: total,
    completedTopics: completed,
    overallPercent: percent,
    totalPaths: learningAcademyPaths.length,
    totalEstimatedHours: '19 hrs 30 mins'
  }
}
