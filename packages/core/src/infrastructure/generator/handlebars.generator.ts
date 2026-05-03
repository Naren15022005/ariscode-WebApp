import Handlebars from 'handlebars';
import { GeneratedFile, Template } from '@ariscode/shared';
import { IGenerator } from '../../domain/repositories';

export class HandlebarsGenerator implements IGenerator {
  constructor() {
    this.registerHelpers();
  }

  async generate(template: Template, variables: Record<string, unknown>): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    try {
      const compiled = Handlebars.compile(template.content);
      const output = compiled(variables);

      files.push({
        path: template.name,
        content: output,
        language: this.inferLanguage(template.name),
      });
    } catch (error) {
      throw new Error(`Template compilation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return files;
  }

  private registerHelpers(): void {
    Handlebars.registerHelper('uppercase', (str: string) => str?.toUpperCase());
    Handlebars.registerHelper('lowercase', (str: string) => str?.toLowerCase());
    Handlebars.registerHelper('pascalcase', (str: string) => {
      if (!str) return '';
      return str.split(/[-_\s]/g).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    });
    Handlebars.registerHelper('camelcase', (str: string) => {
      if (!str) return '';
      const pascal = str.split(/[-_\s]/g).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
      return pascal.charAt(0).toLowerCase() + pascal.slice(1);
    });
    Handlebars.registerHelper('kebabcase', (str: string) => {
      if (!str) return '';
      return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    });
  }

  private inferLanguage(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      go: 'go',
      rs: 'rust',
      rb: 'ruby',
      php: 'php',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      html: 'html',
      css: 'css',
      scss: 'scss',
    };
    return languageMap[ext] || 'text';
  }
}
