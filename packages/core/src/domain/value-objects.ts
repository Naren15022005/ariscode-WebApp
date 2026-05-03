import { PatternScore, GitHubRepository } from '@ariscode/shared';

export class RepositoryMetadata {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly url: string,
    readonly stars: number,
    readonly language: string,
    readonly license: string | null,
    readonly lastActivity: number,
    readonly qualityScore: number,
    readonly lastSynced: number,
  ) {}

  isActive(): boolean {
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    return Date.now() - this.lastActivity < thirtyDaysMs;
  }

  meetsQualityThreshold(threshold: number = 70): boolean {
    return this.qualityScore >= threshold;
  }
}

export class GenerationMetrics {
  constructor(
    readonly startTime: number,
    readonly endTime: number,
    readonly filesGenerated: number,
  ) {}

  duration(): number {
    return this.endTime - this.startTime;
  }

  meetsPerformanceTarget(targetMs: number = 500): boolean {
    return this.duration() <= targetMs;
  }
}

export class PatternScoreCalculator {
  static calculate(
    stars: number,
    recencyScore: number,
    maintenanceScore: number,
    licenseBonus: number,
  ): PatternScore {
    const weights = { stars: 0.3, recency: 0.3, maintenance: 0.2, license: 0.2 };
    const total = stars * weights.stars + recencyScore * weights.recency + maintenanceScore * weights.maintenance + licenseBonus * weights.license;
    return { stars, recency: recencyScore, maintenance: maintenanceScore, license: licenseBonus, total };
  }

  static meetsThreshold(score: PatternScore, threshold: number = 70): boolean {
    return score.total >= threshold;
  }
}
