import { AWESOME_LISTS, SyncResult, SyncStatus, GITHUB_SYNC_INTERVAL, PatternPriority } from '@ariscode/shared';
import { GitHubScraper } from './scraper';
import { IPatternRepository } from '../../domain/repositories';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export class GitHubSyncOrchestrator {
  private scraper: GitHubScraper;

  constructor(
    private patternRepository: IPatternRepository,
    githubToken?: string,
  ) {
    this.scraper = new GitHubScraper(githubToken);
  }

  async execute(): Promise<SyncResult> {
    const startTime = Date.now();
    let patternsAdded = 0;
    let patternsUpdated = 0;

    try {
      console.log('Starting GitHub sync...');

      for (const list of AWESOME_LISTS) {
        console.log(`Scraping ${list}...`);
        const repos = await this.scraper.scrapeAwesomeList(list);

        for (const repo of repos) {
          const existingPattern = await this.patternRepository.findById(repo.id);

          if (!existingPattern) {
            // Create new pattern from repo metadata
            const newPattern = {
              id: repo.id,
              name: repo.name,
              description: `Pattern from ${repo.url}`,
              framework: this.inferFramework(repo.language),
              language: repo.language.toLowerCase(),
              category: 'github-curated',
              template: '// Auto-generated pattern',
              priority: PatternPriority.GITHUB,
              source: repo.url,
              gitHubUrl: repo.url,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              userModified: false,
              updateAvailable: false,
            };

            await this.patternRepository.create(newPattern);
            patternsAdded++;
            console.log(`Added pattern: ${repo.name}`);
          } else if (!existingPattern.userModified) {
            // Update existing pattern if not user-modified
            await this.patternRepository.update(repo.id, {
              updatedAt: Date.now(),
            });
            patternsUpdated++;
          } else {
            // Mark as update available
            await this.patternRepository.update(repo.id, {
              updateAvailable: true,
            });
          }
        }
      }

      const result: SyncResult = {
        status: SyncStatus.SUCCESS,
        patternsAdded,
        patternsUpdated,
        solutionsAdded: 0, // TODO: Implement issue extraction
        solutionsUpdated: 0,
        lastSync: Date.now(),
      };

      console.log(`Sync completed. Added: ${patternsAdded}, Updated: ${patternsUpdated}`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Sync failed:', errorMessage);

      return {
        status: SyncStatus.ERROR,
        patternsAdded: 0,
        patternsUpdated: 0,
        solutionsAdded: 0,
        solutionsUpdated: 0,
        lastSync: Date.now(),
        error: errorMessage,
      };
    }
  }

  private inferFramework(language: string): string {
    const frameworkMap: Record<string, string> = {
      typescript: 'nodejs',
      javascript: 'nodejs',
      python: 'python',
      java: 'spring',
      go: 'go',
      rust: 'rust',
      php: 'laravel',
    };
    return frameworkMap[language.toLowerCase()] || 'other';
  }

  static async scheduleDailySync(orchestrator: GitHubSyncOrchestrator): Promise<void> {
    // Schedule sync to run daily at 2 AM UTC
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setUTCHours(2, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();

    console.log(`Scheduled GitHub sync for ${nextRun.toISOString()}`);

    setTimeout(() => {
      orchestrator.execute();
      // Reschedule for next day
      setInterval(() => orchestrator.execute(), GITHUB_SYNC_INTERVAL);
    }, delayMs);
  }
}
