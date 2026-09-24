import iamChallenges from './iam.js'
import s3Challenges from './s3.js'
import networkingChallenges from './networking.js'
import monitoringChallenges from './monitoring.js'
import architectureChallenges from './architecture.js'

export const domainChallenges = { iam: iamChallenges, s3: s3Challenges, networking: networkingChallenges, monitoring: monitoringChallenges, architecture: architectureChallenges }
export default Object.values(domainChallenges).flat()
