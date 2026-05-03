import { Pattern, PatternPriority } from '@ariscode/shared';

export class ASTAnalyzer {
  extractPatternsFromRepo(repoName: string, repoUrl: string): Pattern[] {
    // Stub implementation - in production, would use @babel/parser and php-parser
    const patterns: Pattern[] = [];

    // Detect framework from repo name/structure
    const frameworks = this.detectFrameworks(repoName);

    for (const framework of frameworks) {
      patterns.push({
        id: `github-${repoName}-${framework}-${Date.now()}`,
        name: `${this.capitalize(repoName)} - ${framework.toUpperCase()}`,
        description: `Pattern extracted from ${repoUrl}`,
        framework,
        language: this.getLanguageForFramework(framework),
        category: 'github-extracted',
        template: `// Extracted from ${repoName}\n// Framework: ${framework}\n// Auto-generated pattern`,
        config: {},
        priority: PatternPriority.GITHUB,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userModified: false,
        updateAvailable: false,
      });
    }

    return patterns;
  }

  private detectFrameworks(repoName: string): string[] {
    const name = repoName.toLowerCase();
    const frameworks: string[] = [];

    if (name.includes('react')) frameworks.push('react');
    if (name.includes('vue')) frameworks.push('vue');
    if (name.includes('angular')) frameworks.push('angular');
    if (name.includes('next')) frameworks.push('next');
    if (name.includes('nuxt')) frameworks.push('nuxt');
    if (name.includes('nest') || name.includes('nestjs')) frameworks.push('nestjs');
    if (name.includes('express')) frameworks.push('express');
    if (name.includes('fastify')) frameworks.push('fastify');
    if (name.includes('laravel')) frameworks.push('laravel');
    if (name.includes('symfony')) frameworks.push('symfony');
    if (name.includes('django')) frameworks.push('django');
    if (name.includes('flask')) frameworks.push('flask');
    if (name.includes('rails')) frameworks.push('rails');

    return frameworks.length > 0 ? frameworks : ['nodejs'];
  }

  private getLanguageForFramework(framework: string): string {
    const languageMap: Record<string, string> = {
      react: 'typescript',
      vue: 'typescript',
      angular: 'typescript',
      next: 'typescript',
      nuxt: 'typescript',
      nestjs: 'typescript',
      express: 'typescript',
      fastify: 'typescript',
      laravel: 'php',
      symfony: 'php',
      django: 'python',
      flask: 'python',
      rails: 'ruby',
    };
    return languageMap[framework] || 'typescript';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
