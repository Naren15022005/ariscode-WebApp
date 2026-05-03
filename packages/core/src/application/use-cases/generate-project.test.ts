import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GenerateProjectUseCase } from '../application/use-cases';
import { IPatternRepository, IGenerator, ITemplateRepository } from '../../domain/repositories';
import { Pattern, Template, PatternPriority } from '@ariscode/shared';

describe('GenerateProjectUseCase', () => {
  let useCase: GenerateProjectUseCase;
  let mockPatternRepository: IPatternRepository;
  let mockTemplateRepository: ITemplateRepository;
  let mockGenerator: IGenerator;

  beforeEach(() => {
    mockPatternRepository = {
      findById: vi.fn(),
    } as any;

    mockTemplateRepository = {
      findById: vi.fn(),
    } as any;

    mockGenerator = {
      generate: vi.fn(),
    } as any;

    useCase = new GenerateProjectUseCase(
      mockPatternRepository,
      mockTemplateRepository,
      mockGenerator,
    );
  });

  it('should generate project with valid pattern', async () => {
    const pattern: Pattern = {
      id: 'test-pattern',
      name: 'Test Pattern',
      description: 'Test',
      framework: 'nestjs',
      language: 'typescript',
      category: 'api',
      template: 'test template',
      priority: PatternPriority.BASE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const template: Template = {
      id: 'test-pattern',
      name: 'test.ts',
      description: 'Test',
      content: 'console.log("test")',
      variables: [],
      createdAt: Date.now(),
    };

    vi.mocked(mockPatternRepository.findById).mockResolvedValue(pattern);
    vi.mocked(mockTemplateRepository.findById).mockResolvedValue(template);
    vi.mocked(mockGenerator.generate).mockResolvedValue([
      {
        path: 'test.ts',
        content: 'console.log("test")',
        language: 'typescript',
      },
    ]);

    const result = await useCase.execute({
      patternId: 'test-pattern',
      variables: {},
    });

    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('test.ts');
  });

  it('should throw error if pattern not found', async () => {
    vi.mocked(mockPatternRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        patternId: 'nonexistent',
        variables: {},
      }),
    ).rejects.toThrow('Pattern not found');
  });
});
