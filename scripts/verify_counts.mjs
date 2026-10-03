import { MASTER_INCIDENT_BANK } from '../src/data/expandedIncidentBank.js';
import { ENTERPRISE_INCIDENTS } from '../src/data/incidentLibrary.js';
import { investigations } from '../src/data/investigations.js';
import { MASTER_ARCHITECTURE_REVIEWS } from '../src/data/expandedArchitectureBank.js';
import architecture from '../src/data/architecture.js';
import { MASTER_THREAT_HUNTS } from '../src/data/expandedThreatHunts.js';
import threatScenarios from '../src/data/threatScenarios.js';
import { MASTER_SAFE_LABS } from '../src/data/expandedSafeLabs.js';
import { realLabs } from '../src/data/jobLabs.js';
import { MASTER_CASE_STUDIES } from '../src/data/caseStudiesBank.js';
import { ROLE_ROADMAPS } from '../src/data/expandedRoleRoadmaps.js';
import { MASTER_INTERVIEW_BANK } from '../src/data/expandedInterviewBank.js';
import { battleRooms } from '../src/data/battleRooms.js';
import { cloudProjects } from '../src/data/cloudProjects.js';

import fs from 'fs';
import path from 'path';

console.log('=== SECLOUDIVE CONTENT INVENTORY ===');
console.log('1. Incident Scenarios:');
console.log('   - MASTER_INCIDENT_BANK:', MASTER_INCIDENT_BANK?.length);
console.log('   - investigations (investigation simulator):', investigations?.length);
console.log('   - ENTERPRISE_INCIDENTS:', ENTERPRISE_INCIDENTS?.length);

console.log('2. Architecture Reviews:');
console.log('   - MASTER_ARCHITECTURE_REVIEWS:', MASTER_ARCHITECTURE_REVIEWS?.length);
console.log('   - architecture (base):', architecture?.length);

console.log('3. Threat Hunts:');
console.log('   - MASTER_THREAT_HUNTS:', MASTER_THREAT_HUNTS?.length);
console.log('   - threatScenarios (base):', threatScenarios?.length);

console.log('4. Labs:');
console.log('   - MASTER_SAFE_LABS:', MASTER_SAFE_LABS?.length);
console.log('   - realLabs:', realLabs?.length);

console.log('5. Case Studies:');
console.log('   - MASTER_CASE_STUDIES:', MASTER_CASE_STUDIES?.length);

console.log('6. Other content banks:');
console.log('   - ROLE_ROADMAPS:', ROLE_ROADMAPS?.length);
console.log('   - MASTER_INTERVIEW_BANK:', MASTER_INTERVIEW_BANK?.length);
console.log('   - battleRooms:', battleRooms?.length);
console.log('   - cloudProjects:', cloudProjects?.length);

// Count learning modules & questions
const learningDir = './src/data/learning';
const files = fs.readdirSync(learningDir);
console.log('\nLearning directory files:', files);

let totalQuizzes = 0;
let totalTopics = 0;

try {
  const { moduleQuizzes } = await import('../src/data/learning/moduleQuizzes.js');
  console.log('moduleQuizzes count:', Object.keys(moduleQuizzes || {}).length);
  for (const k of Object.keys(moduleQuizzes || {})) {
    totalQuizzes += moduleQuizzes[k]?.length || 0;
  }
  console.log('Total questions across moduleQuizzes:', totalQuizzes);
} catch (e) {
  console.log('Error reading moduleQuizzes:', e.message);
}

try {
  const { foundationsPath } = await import('../src/data/learning/foundationsPath.js');
  const { iamPath } = await import('../src/data/learning/iamPath.js');
  const { s3Path } = await import('../src/data/learning/s3Path.js');
  const { networkPath } = await import('../src/data/learning/networkPath.js');
  const { monitoringPath } = await import('../src/data/learning/monitoringPath.js');
  const { incidentResponsePath } = await import('../src/data/learning/incidentResponsePath.js');
  const { architecturePath } = await import('../src/data/learning/architecturePath.js');
  const { careerPath } = await import('../src/data/learning/careerPath.js');

  const paths = [
    ['foundationsPath', foundationsPath],
    ['iamPath', iamPath],
    ['s3Path', s3Path],
    ['networkPath', networkPath],
    ['monitoringPath', monitoringPath],
    ['incidentResponsePath', incidentResponsePath],
    ['architecturePath', architecturePath],
    ['careerPath', careerPath]
  ];

  let pathModulesCount = 0;
  for (const [name, p] of paths) {
    const modules = p?.modules || [];
    pathModulesCount += modules.length;
    console.log(`   - ${name}: ${modules.length} modules`);
    for (const m of modules) {
      if (m.topics) totalTopics += m.topics.length;
    }
  }
  console.log('Total learning path modules:', pathModulesCount);
  console.log('Total topics across learning paths:', totalTopics);
} catch (e) {
  console.log('Error reading paths:', e.message);
}
