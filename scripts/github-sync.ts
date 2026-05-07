#!/usr/bin/env node
/**
 * Manual trigger for GitHub sync pipeline.
 * Usage: GITHUB_TOKEN=xxx npx ts-node scripts/github-sync.ts
 *
 * In production this is triggered by .github/workflows/sync-github.yml every 6 hours.
 */
import { SyncOrchestrator } from '../packages/core/src/infrastructure/github/sync-orchestrator.js';

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('ERROR: GITHUB_TOKEN environment variable is required.');
  process.exit(1);
}

console.log('Starting GitHub sync…');
const orchestrator = new SyncOrchestrator(token);

orchestrator
  .run()
  .then((stats) => {
    console.log('\nSync complete:');
    console.log(`  Repos processed:   ${stats.reposProcessed}`);
    console.log(`  Patterns added:    ${stats.patternsAdded}`);
    console.log(`  Patterns updated:  ${stats.patternsUpdated}`);
    console.log(`  Solutions added:   ${stats.solutionsAdded}`);
  })
  .catch((err) => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
