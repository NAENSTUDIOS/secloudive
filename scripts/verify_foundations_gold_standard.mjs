import { foundationsPath } from '../src/data/learning/foundationsPath.js';
import fs from 'fs';

const downloads = JSON.parse(fs.readFileSync('./src/data/cloudive/downloads.json', 'utf8'));
const downloadIds = new Set(downloads.map(d => d.id));

console.log('================================================================');
console.log('COMPREHENSIVE FOUNDATIONS PATH GOLD STANDARD VERIFICATION');
console.log('================================================================');

let allPassed = true;
let totalTopics = foundationsPath.topics.length;

console.log(`Auditing all ${totalTopics} topics in foundationsPath...\n`);

foundationsPath.topics.forEach((topic, idx) => {
  const issues = [];
  
  // 1. Overview Modules
  const moduleMatches = topic.overview.match(/\d+\.\s+\*\*[^*]+\*\*:/g) || [];
  if (moduleMatches.length < 8) {
    issues.push(`Overview has ${moduleMatches.length} modules (expected >= 8)`);
  }
  
  // 2. Engineer Checks
  if (!Array.isArray(topic.whatACloudSecEngineerChecks) || topic.whatACloudSecEngineerChecks.length < 6) {
    issues.push(`whatACloudSecEngineerChecks has ${topic.whatACloudSecEngineerChecks?.length || 0} checks (expected >= 6)`);
  } else {
    topic.whatACloudSecEngineerChecks.forEach((chk, cIdx) => {
      if (typeof chk !== 'object' || !chk.title || !chk.command || !chk.explanation) {
        issues.push(`Check #${cIdx + 1} is missing title, command, or explanation`);
      }
    });
  }
  
  // 3. Code Snippet
  if (!topic.codeSnippet || !topic.codeSnippet.code || !topic.codeSnippet.title || !topic.codeSnippet.language) {
    issues.push('codeSnippet is missing or incomplete');
  }
  
  // 4. Code Example (Cheat Sheet)
  if (!topic.codeExample || !topic.codeExample.code || !topic.codeExample.title || !topic.codeExample.language) {
    issues.push('codeExample is missing or incomplete');
  }
  
  // 5. AWS / Practice Resources
  if (!Array.isArray(topic.awsResources) || topic.awsResources.length < 6) {
    issues.push(`awsResources has ${topic.awsResources?.length || 0} resources (expected >= 6)`);
  } else {
    topic.awsResources.forEach((res, rIdx) => {
      if (!res.title || !res.url || !res.type || !res.why || !res.description) {
        issues.push(`Resource #${rIdx + 1} missing required metadata fields`);
      }
    });
  }
  
  // 6. Bridge to Labs & Downloads
  if (!topic.bridgeToLabs || topic.bridgeToLabs.url !== '/downloads') {
    issues.push(`bridgeToLabs url is not '/downloads' (got: ${topic.bridgeToLabs?.url})`);
  }
  if (!topic.bridgeToLabs?.id || !downloadIds.has(topic.bridgeToLabs.id)) {
    issues.push(`bridgeToLabs id '${topic.bridgeToLabs?.id}' not found in downloads.json`);
  }
  
  // 7. Interview Questions
  if (!Array.isArray(topic.interviewQuestions) || topic.interviewQuestions.length < 2) {
    issues.push(`interviewQuestions has ${topic.interviewQuestions?.length || 0} questions (expected >= 2)`);
  }
  
  // 8. Real World Scenario
  if (!topic.realWorldScenario || !topic.realWorldScenario.title || !topic.realWorldScenario.incident || !topic.realWorldScenario.detectionMethod) {
    issues.push('realWorldScenario missing required fields');
  }

  // 9. Knowledge Check
  if (!topic.knowledgeCheck || !topic.knowledgeCheck.question || !Array.isArray(topic.knowledgeCheck.options) || topic.knowledgeCheck.options.length < 4) {
    issues.push('knowledgeCheck missing question or 4 options');
  }

  if (issues.length > 0) {
    allPassed = false;
    console.error(`❌ [FAIL] Topic ${idx + 1}: ${topic.id} (${topic.title})`);
    issues.forEach(err => console.error(`   - ${err}`));
  } else {
    console.log(`✅ [PASS] Topic ${idx + 1}: ${topic.id}`);
    console.log(`   Modules: ${moduleMatches.length} | CLI Checks: ${topic.whatACloudSecEngineerChecks.length} | Resources: ${topic.awsResources.length} | Bridge: ${topic.bridgeToLabs.id}`);
  }
});

console.log('\n================================================================');
if (allPassed) {
  console.log(`🎉 100% SUCCESS: ALL ${totalTopics} TOPICS SATISFY NAEN STUDIOS GOLD STANDARD!`);
} else {
  console.error('❌ SOME TOPICS FAILED VERIFICATION.');
  process.exit(1);
}
console.log('================================================================');
