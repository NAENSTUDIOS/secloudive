import { foundationsPath } from '../src/data/learning/foundationsPath.js';

console.log('Total topics in Foundations:', foundationsPath.topics.length);
foundationsPath.topics.forEach((t, i) => {
  const modules = (t.overview.match(/\d+\.\s+\*\*/g) || []).length;
  const checksAreObjects = t.whatACloudSecEngineerChecks && t.whatACloudSecEngineerChecks.every(c => typeof c === 'object' && c.command);
  const checksCount = t.whatACloudSecEngineerChecks ? t.whatACloudSecEngineerChecks.length : 0;
  const hasSnippet = !!t.codeSnippet;
  const hasExample = !!t.codeExample;
  const resCount = t.awsResources ? t.awsResources.length : 0;
  const bridgeId = t.bridgeToLabs ? t.bridgeToLabs.id : 'none';
  const bridgeUrl = t.bridgeToLabs ? t.bridgeToLabs.url : 'none';
  
  console.log(`${i+1}. [${t.id}] ${t.title}`);
  console.log(`   Modules: ${modules} | Checks: ${checksCount} (Objects: ${checksAreObjects}) | Snippet: ${hasSnippet} | Example: ${hasExample} | Resources: ${resCount} | Bridge: ${bridgeId} (${bridgeUrl})`);
});
