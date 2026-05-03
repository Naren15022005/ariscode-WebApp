interface RepoMetrics {
  stars: number;
  lastActivity: number;
  maintenanceScore: number;
  licenseBonus: number;
}

export class QualityScorer {
  private readonly QUALITY_THRESHOLD = 70;
  private readonly PERMISSIVE_LICENSES = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC'];

  calculateScore(metrics: RepoMetrics): number {
    const starsScore = this.normalizeStars(metrics.stars);
    const recencyScore = this.calculateRecency(metrics.lastActivity);
    const maintenanceScore = metrics.maintenanceScore;
    const licenseBonus = metrics.licenseBonus;

    const score =
      starsScore * 0.3 +
      recencyScore * 0.3 +
      maintenanceScore * 0.2 +
      licenseBonus * 0.2;

    return score;
  }

  private normalizeStars(stars: number): number {
    // Normalize stars: 1k = 50 points, 10k = 80 points, 100k+ = 100 points
    if (stars < 1000) return Math.min(30, (stars / 1000) * 50);
    if (stars < 10000) return Math.min(80, 50 + ((stars - 1000) / 9000) * 30);
    return 100;
  }

  private calculateRecency(lastActivity: number): number {
    const now = Date.now();
    const daysAgo = (now - lastActivity) / (1000 * 60 * 60 * 24);

    if (daysAgo < 7) return 100;
    if (daysAgo < 30) return 80;
    if (daysAgo < 90) return 60;
    if (daysAgo < 180) return 40;
    return 20;
  }

  isLicensePermissive(license: string | undefined | null): boolean {
    if (!license) return false;
    return this.PERMISSIVE_LICENSES.some((l) => license.toUpperCase().includes(l));
  }

  meetsThreshold(score: number): boolean {
    return score >= this.QUALITY_THRESHOLD;
  }
}

