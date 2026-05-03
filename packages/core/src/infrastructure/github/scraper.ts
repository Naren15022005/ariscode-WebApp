import { Octokit } from '@octokit/rest';
import { PERMISSIVE_LICENSES, QUALITY_SCORE_THRESHOLD } from '@ariscode/shared';
import { PatternScoreCalculator, RepositoryMetadata } from '../../domain/value-objects';

export class GitHubScraper {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit(token ? { auth: token } : {});
  }

  async scrapeAwesomeList(listName: string): Promise<RepositoryMetadata[]> {
    const repos: RepositoryMetadata[] = [];

    try {
      const response = await this.octokit.search.repos({
        q: `awesome-${listName}`,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
      });

      for (const repo of response.data.items) {
        if (!repo.full_name || !repo.url) continue;

        const metadata = await this.calculateMetadata(repo.full_name, repo);
        if (metadata && metadata.qualityScore >= QUALITY_SCORE_THRESHOLD) {
          repos.push(metadata);
        }
      }
    } catch (error) {
      console.error(`Failed to scrape awesome list ${listName}:`, error);
    }

    return repos;
  }

  async scrapeTrendingRepos(language: string): Promise<RepositoryMetadata[]> {
    const repos: RepositoryMetadata[] = [];

    try {
      const response = await this.octokit.search.repos({
        q: `language:${language} stars:>1000`,
        sort: 'stars',
        order: 'desc',
        per_page: 20,
      });

      for (const repo of response.data.items) {
        if (!repo.full_name || !repo.url) continue;

        const metadata = await this.calculateMetadata(repo.full_name, repo);
        if (metadata && metadata.qualityScore >= QUALITY_SCORE_THRESHOLD) {
          repos.push(metadata);
        }
      }
    } catch (error) {
      console.error(`Failed to scrape trending repos for ${language}:`, error);
    }

    return repos;
  }

  private async calculateMetadata(fullName: string, repo: any): Promise<RepositoryMetadata | null> {
    try {
      const [owner, repoName] = fullName.split('/');

      const repoData = await this.octokit.repos.get({ owner, repo: repoName });

      const stars = repoData.data.stargazers_count || 0;
      const language = repoData.data.language || 'unknown';
      const license = repoData.data.license?.spdx_id || null;
      const lastActivity = new Date(repoData.data.pushed_at || 0).getTime();
      const createdAt = new Date(repoData.data.created_at || 0).getTime();

      const recencyScore = this.calculateRecencyScore(lastActivity);
      const maintenanceScore = this.calculateMaintenanceScore(lastActivity, createdAt);
      const licenseBonus = license && PERMISSIVE_LICENSES.includes(license) ? 100 : 20;

      const score = PatternScoreCalculator.calculate(stars, recencyScore, maintenanceScore, licenseBonus);

      return new RepositoryMetadata(
        fullName,
        repoName,
        repoData.data.html_url || '',
        stars,
        language,
        license,
        lastActivity,
        score.total,
        Date.now(),
      );
    } catch (error) {
      console.error(`Failed to calculate metadata for ${fullName}:`, error);
      return null;
    }
  }

  private calculateRecencyScore(lastActivityTime: number): number {
    const daysSinceActivity = (Date.now() - lastActivityTime) / (1000 * 60 * 60 * 24);
    const thirtyDays = 30;
    return Math.max(0, 100 - (daysSinceActivity / thirtyDays) * 50);
  }

  private calculateMaintenanceScore(lastActivityTime: number, createdAtTime: number): number {
    const daysSinceActivity = (Date.now() - lastActivityTime) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity > 180) return 10;
    if (daysSinceActivity > 90) return 50;
    return 100;
  }
}
