import { Solution, SolutionSource } from '@ariscode/shared';

export class IssueExtractor {
  extractSolutionsFromIssues(repoName: string, issues: any[]): Solution[] {
    // Stub implementation - in production, would parse real GitHub issues
    const solutions: Solution[] = [];

    const relevantIssues = issues.filter(
      (issue) =>
        issue.labels?.some((label: any) =>
          ['solution', 'workaround', 'fix', 'how-to'].includes(label.name?.toLowerCase())
        ) && issue.state === 'closed'
    );

    for (const issue of relevantIssues.slice(0, 5)) {
      // Limit to 5 per repo
      solutions.push({
        id: `github-${repoName}-issue-${issue.number}-${Date.now()}`,
        title: issue.title,
        description: issue.body || '',
        errorPattern: this.extractErrorPattern(issue.title),
        solution: issue.body?.split('\n').slice(0, 5).join('\n') || 'See GitHub issue for details',
        source: SolutionSource.GITHUB_ISSUE,
        tags: [repoName, ...((issue.labels as any[]) || []).map((l) => l.name)],
        gitHubUrl: issue.html_url,
        createdAt: new Date(issue.created_at).getTime(),
        updatedAt: new Date(issue.updated_at).getTime(),
        userModified: false,
      });
    }

    return solutions;
  }

  private extractErrorPattern(title: string): string {
    // Extract common error patterns
    const patterns = ['Error:', 'TypeError:', 'ReferenceError:', 'Cannot find', 'undefined is not'];
    for (const pattern of patterns) {
      if (title.includes(pattern)) {
        return title.split('\n')[0];
      }
    }
    return title;
  }
}
