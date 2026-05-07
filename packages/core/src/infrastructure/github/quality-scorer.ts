export interface RepositoryQuality {
  stars: number;
  daysSinceLastCommit: number;
  issueClosureRate: number;
  prMergeRate: number;
  hasTests: boolean;
  testCoverage: number;
  readmeLength: number;
  license: string | undefined | null;
  isPermissive: boolean;
  userFeedback?: { upvotes: number; downvotes: number };
}

const PERMISSIVE_LICENSES = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC'];
const QUALITY_THRESHOLD = 70;

export class QualityScorer {
  static calculate(repo: RepositoryQuality): number {
    // GPL and non-permissive = auto-reject
    if (!repo.isPermissive) return 0;

    // Dead repos = auto-reject
    if (repo.daysSinceLastCommit > 180) return 0;

    let score = 0;

    // Stars (logarithmic — capped at 30 points)
    score += Math.min(30, (Math.log(repo.stars + 1) / Math.log(100_000)) * 30);

    // Recency penalty
    if (repo.daysSinceLastCommit > 90) score -= 25;
    else if (repo.daysSinceLastCommit > 30) score -= 10;
    else if (repo.daysSinceLastCommit <= 7) score += 5;

    // Maintenance (issue closure + PR merge rates)
    score += repo.issueClosureRate * 20;
    score += repo.prMergeRate * 15;

    // Testing
    if (repo.hasTests) {
      score += Math.min(10, repo.testCoverage / 10);
    }

    // Documentation (readme length)
    score += Math.min(10, repo.readmeLength / 500);

    // Community feedback
    if (repo.userFeedback) {
      const { upvotes, downvotes } = repo.userFeedback;
      const ratio = upvotes / Math.max(downvotes, 1);
      if (ratio < 0.5) score -= 30;
      else if (ratio >= 2) score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  static isPermissiveLicense(license: string | undefined | null): boolean {
    if (!license) return false;
    return PERMISSIVE_LICENSES.some((l) => license.toUpperCase().includes(l.toUpperCase()));
  }

  static meetsThreshold(score: number): boolean {
    return score >= QUALITY_THRESHOLD;
  }

  /** Legacy instance-based API kept for backward compatibility */
  calculateScore(metrics: { stars: number; lastActivity: number; maintenanceScore: number; licenseBonus: number }): number {
    const daysSinceLastCommit = (Date.now() - metrics.lastActivity) / (1000 * 60 * 60 * 24);
    return QualityScorer.calculate({
      stars: metrics.stars,
      daysSinceLastCommit,
      issueClosureRate: metrics.maintenanceScore / 100,
      prMergeRate: metrics.maintenanceScore / 100,
      hasTests: false,
      testCoverage: 0,
      readmeLength: 0,
      license: null,
      isPermissive: metrics.licenseBonus > 0,
    });
  }

  isLicensePermissive(license: string | undefined | null): boolean {
    return QualityScorer.isPermissiveLicense(license);
  }

  meetsThreshold(score: number): boolean {
    return QualityScorer.meetsThreshold(score);
  }
}
