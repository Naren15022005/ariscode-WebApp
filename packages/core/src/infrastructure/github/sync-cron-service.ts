import { IPatternRepository, ISolutionRepository } from '../../domain/repositories';
import { GitHubScraper } from './scraper';
import { QualityScorer } from './quality-scorer';
import { ASTAnalyzer } from './ast-analyzer';
import { IssueExtractor } from './issue-extractor';

export interface SyncStats {
  patternsAdded: number;
  patternsUpdated: number;
  solutionsAdded: number;
  startTime: number;
  endTime: number;
  duration: number;
}

export class SyncCronService {
  constructor(
    private patternRepository: IPatternRepository,
    private solutionRepository: ISolutionRepository,
    private scraper: GitHubScraper,
    private scorer: QualityScorer,
    private astAnalyzer: ASTAnalyzer,
    private issueExtractor: IssueExtractor,
    private githubToken?: string,
  ) {}

  async executeDailySync(): Promise<SyncStats> {
    const startTime = Date.now();
    let patternsAdded = 0;
    let patternsUpdated = 0;
    let solutionsAdded = 0;

    try {
      console.log('🔄 Starting GitHub sync...');

      // Phase 1: Discovery
      const repos = await this.scraper.scrapeAwesomeList('awesome-nodejs');
      console.log(`📚 Found ${repos.length} repositories from awesome lists`);

      // Phase 2: Quality scoring & extraction
      for (const repo of repos.slice(0, 10)) {
        // Limit to 10 for demo
        const score = this.scorer.calculateScore({
          stars: repo.stars,
          lastActivity: repo.lastActivity,
          maintenanceScore: 80,
          licenseBonus: this.scorer.isLicensePermissive(repo.license) ? 100 : 50,
        });

        if (!this.scorer.meetsThreshold(score)) {
          console.log(`⏭️  Skipping ${repo.name} (score: ${score.toFixed(1)}/100)`);
          continue;
        }

        console.log(`✅ Processing ${repo.name} (score: ${score.toFixed(1)}/100)`);

        // Phase 3: Extract patterns
        const patterns = this.astAnalyzer.extractPatternsFromRepo(repo.name, repo.url);
        for (const pattern of patterns) {
          const existing = await this.patternRepository.findById(pattern.id);
          if (!existing) {
            await this.patternRepository.create(pattern);
            patternsAdded++;
          }
        }

        // Phase 4: Extract solutions (stub - would need real issue API)
        const issues: any[] = [];
        const solutions = this.issueExtractor.extractSolutionsFromIssues(repo.name, issues);
        for (const solution of solutions) {
          const existing = await this.solutionRepository.findById(solution.id);
          if (!existing) {
            await this.solutionRepository.create(solution);
            solutionsAdded++;
          }
        }
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(
        `\n✨ Sync completed in ${(duration / 1000).toFixed(1)}s\n` +
          `  Patterns added: ${patternsAdded}\n` +
          `  Solutions added: ${solutionsAdded}`
      );

      return {
        patternsAdded,
        patternsUpdated,
        solutionsAdded,
        startTime,
        endTime,
        duration,
      };
    } catch (error) {
      console.error('❌ Sync failed:', error);
      const endTime = Date.now();
      return {
        patternsAdded,
        patternsUpdated,
        solutionsAdded,
        startTime,
        endTime,
        duration: endTime - startTime,
      };
    }
  }

  static scheduleDaily(service: SyncCronService): void {
    // Run at 2 AM UTC daily
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setUTCHours(2, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delayMs = nextRun.getTime() - now.getTime();
    console.log(`⏱️  Next GitHub sync scheduled for ${nextRun.toISOString()}`);

    setTimeout(() => {
      service.executeDailySync();
      setInterval(() => service.executeDailySync(), 86400000);
    }, delayMs);
  }
}
