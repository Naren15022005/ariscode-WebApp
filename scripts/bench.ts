#!/usr/bin/env node
/**
 * Generation performance benchmark.
 * Usage: npx ts-node scripts/bench.ts [--count 1000]
 *
 * Validates the <500ms invariant under load.
 */
import { HandlebarsGenerator } from '../packages/core/src/infrastructure/generator/handlebars.generator.js';
import type { Template } from '../packages/shared/src/index.js';

const args = process.argv.slice(2);
const countIdx = args.indexOf('--count');
const COUNT = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) : 100;

const generator = new HandlebarsGenerator();

const mockTemplate: Template = {
  id: 'bench-template',
  name: 'Bench',
  description: 'Benchmark template',
  content: 'export const {{name}} = "{{value}}";',
  variables: [
    { name: 'name', type: 'string', required: true },
    { name: 'value', type: 'string', required: true },
  ],
  createdAt: Date.now(),
};

const variables = { name: 'benchResult', value: 'hello' };

async function runBench(count: number) {
  const times: number[] = [];

  for (let i = 0; i < count; i++) {
    const start = performance.now();
    await generator.generate(mockTemplate, variables);
    times.push(performance.now() - start);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const max = Math.max(...times);
  const p99 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.99)];

  console.log(`\nBenchmark — ${count} generations`);
  console.log(`  avg:  ${avg.toFixed(2)}ms`);
  console.log(`  max:  ${max.toFixed(2)}ms`);
  console.log(`  p99:  ${p99.toFixed(2)}ms`);

  if (max > 500) {
    console.error(`\n  ❌ FAIL: max (${max.toFixed(0)}ms) exceeds 500ms target`);
    process.exit(1);
  } else {
    console.log(`\n  ✓ All within 500ms target`);
  }
}

runBench(COUNT);
