import { Pattern, GenerationConfig, GeneratedFile, Project, Solution, Conversation, ConversationMessage, Session } from '@ariscode/shared';
import { IPatternRepository, IGenerator, ITemplateRepository, IProjectRepository, ISolutionRepository, IConversationRepository, ISessionRepository } from '../../domain/repositories';
import { SyncCronService, SyncStats } from '../../infrastructure/github/sync-cron-service';

export class GenerateProjectUseCase {
  constructor(
    private patternRepository: IPatternRepository,
    private templateRepository: ITemplateRepository,
    private generator: IGenerator,
  ) {}

  async execute(config: GenerationConfig): Promise<GeneratedFile[]> {
    const pattern = await this.patternRepository.findById(config.patternId);
    if (!pattern) {
      throw new Error(`Pattern not found: ${config.patternId}`);
    }

    const template = await this.templateRepository.findById(pattern.id);
    if (!template) {
      throw new Error(`Template not found for pattern: ${config.patternId}`);
    }

    const startTime = Date.now();
    const files = await this.generator.generate(template, config.variables);
    const endTime = Date.now();

    const duration = endTime - startTime;
    if (duration > 500) {
      console.warn(`Generation took ${duration}ms, exceeds 500ms target`);
    }

    return files;
  }
}

export class GetTemplatesUseCase {
  constructor(private templateRepository: ITemplateRepository) {}

  async execute(): Promise<any[]> {
    return this.templateRepository.findAll();
  }
}

export class SearchPatternsUseCase {
  constructor(private patternRepository: IPatternRepository) {}

  async execute(query: string): Promise<Pattern[]> {
    if (!query || query.trim().length === 0) {
      return this.patternRepository.findAll();
    }
    return this.patternRepository.search(query);
  }
}

export class GetPatternsByFrameworkUseCase {
  constructor(private patternRepository: IPatternRepository) {}

  async execute(framework: string): Promise<Pattern[]> {
    return this.patternRepository.findByFramework(framework);
  }
}

export class SaveProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(project: Project): Promise<void> {
    if (!project.id) {
      project.id = `project-${Date.now()}`;
    }
    project.createdAt = project.createdAt || Date.now();
    project.updatedAt = Date.now();
    return this.projectRepository.create(project);
  }
}

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(limit: number = 10): Promise<Project[]> {
    return this.projectRepository.findRecent(limit);
  }
}

export class SearchSolutionsUseCase {
  constructor(private solutionRepository: ISolutionRepository) {}

  async execute(query: string): Promise<Solution[]> {
    if (!query || query.trim().length === 0) {
      return this.solutionRepository.findAll();
    }
    return this.solutionRepository.search(query);
  }
}

export class SearchSolutionsByErrorUseCase {
  constructor(private solutionRepository: ISolutionRepository) {}

  async execute(errorMessage: string): Promise<Solution[]> {
    return this.solutionRepository.searchByError(errorMessage);
  }
}

export class GetConversationsUseCase {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(userId?: string): Promise<Conversation[]> {
    return this.conversationRepository.findAll(userId);
  }
}

export class CreateConversationUseCase {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(data: { title: string; userId?: string }): Promise<Conversation> {
    const conversation: Conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId: data.userId ?? 'local',
      title: data.title,
      messages: [],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.conversationRepository.create(conversation);
    return conversation;
  }
}

export class AddMessageUseCase {
  constructor(private conversationRepository: IConversationRepository) {}

  async execute(data: { conversationId: string; role: 'user' | 'system' | 'assistant'; content: string; metadata?: Record<string, string> }): Promise<ConversationMessage> {
    const message: ConversationMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      metadata: data.metadata,
      createdAt: Date.now(),
    };
    await this.conversationRepository.addMessage(message);
    return message;
  }
}

export class SyncGitHubUseCase {
  constructor(private syncService: SyncCronService) {}

  async execute(): Promise<SyncStats> {
    return this.syncService.executeDailySync();
  }
}
