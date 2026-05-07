import { SqliteService } from '../../infrastructure/database/sqlite.service';

export interface GenerateRequest {
  templateId: string;
  variables: Record<string, any>;
  projectName: string;
}

export interface GenerateResponse {
  success: boolean;
  projectId: string;
  files: Array<{ path: string; content: string }>;
  message?: string;
}

export class GenerateProjectUseCase {
  async execute(request: GenerateRequest): Promise<GenerateResponse> {
    try {
      const db = await SqliteService.getInstance();

      // Get template
      const template = db.prepare(
        'SELECT * FROM templates WHERE id = ?'
      ).get(request.templateId);

      if (!template) {
        return {
          success: false,
          projectId: '',
          files: [],
          message: 'Template not found',
        };
      }

      // Generate code by replacing variables in template
      let generatedCode = template.templateContent || '';

      for (const [key, value] of Object.entries(request.variables)) {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        generatedCode = generatedCode.replace(placeholder, String(value));
      }

      // Create project
      const projectId = this.generateId();
      const now = new Date().toISOString();

      const files = [
        {
          path: 'index.ts',
          content: generatedCode,
          language: template.language || 'typescript',
        },
      ];

      // Save to database
      db.prepare(
        `INSERT INTO projects (id, name, templateId, config, files, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      ).run(
        projectId,
        request.projectName,
        request.templateId,
        JSON.stringify(request.variables),
        JSON.stringify(files),
        'generated',
        now,
        now
      );

      // Save individual files
      for (const file of files) {
        db.prepare(
          `INSERT INTO project_files (id, projectId, path, content, language, modifiedAt)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).run(
          this.generateId(),
          projectId,
          file.path,
          file.content,
          file.language,
          now
        );
      }

      await SqliteService.save();

      return {
        success: true,
        projectId,
        files,
        message: 'Project generated successfully',
      };
    } catch (error) {
      return {
        success: false,
        projectId: '',
        files: [],
        message: `Error: ${error}`,
      };
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
