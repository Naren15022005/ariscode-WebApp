import { describe, it, expect } from 'vitest';
import { HandlebarsGenerator } from '../infrastructure/generator/handlebars.generator';
import { Template } from '@ariscode/shared';

describe('HandlebarsGenerator', () => {
  const generator = new HandlebarsGenerator();

  it('should compile and generate code from template', async () => {
    const template: Template = {
      id: 'test-1',
      name: 'test.ts',
      description: 'Test template',
      content: 'const greeting = "Hello {{name}}";\nconsole.log(greeting);',
      variables: [],
      createdAt: Date.now(),
    };

    const files = await generator.generate(template, { name: 'World' });

    expect(files).toHaveLength(1);
    expect(files[0].content).toContain('Hello World');
    expect(files[0].language).toBe('typescript');
  });

  it('should apply pascalcase helper', async () => {
    const template: Template = {
      id: 'test-2',
      name: 'component.tsx',
      description: 'Component template',
      content: 'export function {{pascalcase name}}() {}',
      variables: [],
      createdAt: Date.now(),
    };

    const files = await generator.generate(template, { name: 'my-component' });

    expect(files[0].content).toContain('MyComponent');
  });

  it('should apply camelcase helper', async () => {
    const template: Template = {
      id: 'test-3',
      name: 'service.ts',
      description: 'Service template',
      content: 'export const {{camelcase name}}Service = {}',
      variables: [],
      createdAt: Date.now(),
    };

    const files = await generator.generate(template, { name: 'UserProfile' });

    expect(files[0].content).toContain('userProfileService');
  });

  it('should throw error on invalid template', async () => {
    const template: Template = {
      id: 'test-4',
      name: 'bad.ts',
      description: 'Bad template',
      content: 'const x = {{unclosed',
      variables: [],
      createdAt: Date.now(),
    };

    await expect(generator.generate(template, {})).rejects.toThrow();
  });
});
