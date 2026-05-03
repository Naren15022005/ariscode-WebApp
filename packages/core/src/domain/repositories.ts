import { Pattern, Template, GeneratedFile, Project, Solution } from '@ariscode/shared';

export interface IPatternRepository {
  findById(id: string): Promise<Pattern | null>;
  findByFramework(framework: string): Promise<Pattern[]>;
  findByLanguage(language: string): Promise<Pattern[]>;
  search(query: string): Promise<Pattern[]>;
  findAll(): Promise<Pattern[]>;
  create(pattern: Pattern): Promise<void>;
  update(id: string, pattern: Partial<Pattern>): Promise<void>;
  delete(id: string): Promise<void>;
  findPersonalPatterns(): Promise<Pattern[]>;
}

export interface ITemplateRepository {
  findById(id: string): Promise<Template | null>;
  findAll(): Promise<Template[]>;
  create(template: Template): Promise<void>;
  update(id: string, template: Partial<Template>): Promise<void>;
}

export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  create(project: Project): Promise<void>;
  update(id: string, project: Partial<Project>): Promise<void>;
  delete(id: string): Promise<void>;
  findRecent(limit: number): Promise<Project[]>;
}

export interface ISolutionRepository {
  findById(id: string): Promise<Solution | null>;
  search(query: string): Promise<Solution[]>;
  searchByError(errorMessage: string): Promise<Solution[]>;
  findAll(): Promise<Solution[]>;
  create(solution: Solution): Promise<void>;
  update(id: string, solution: Partial<Solution>): Promise<void>;
  delete(id: string): Promise<void>;
  findPersonalSolutions(): Promise<Solution[]>;
}

export interface IGenerator {
  generate(template: Template, variables: Record<string, unknown>): Promise<GeneratedFile[]>;
}

export interface ISearchIndex {
  index(items: any[]): void;
  search(query: string): string[];
  clear(): void;
}
