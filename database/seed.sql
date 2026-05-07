-- Aris Code — Initial Seed Data
-- Run after all migrations

-- Base templates
INSERT OR IGNORE INTO templates (id, name, description, framework, language, version, source, priority, files, userModified)
VALUES
  ('hello-world', 'Hello World', 'Simple Hello World starter in multiple languages', 'generic', 'typescript', '1.0.0', 'base', 3, '["template.hbs"]', 0),
  ('nestjs-crud', 'NestJS CRUD Module', 'Full CRUD module: entity, service, controller, module, DTOs', 'nestjs', 'typescript', '1.0.0', 'base', 3, '["entity.hbs","service.hbs","controller.hbs","module.hbs","dto/create.hbs"]', 0),
  ('react-component', 'React Component', 'React functional component with props, CSS modules, and tests', 'react', 'typescript', '1.0.0', 'base', 3, '["component.hbs","styles.hbs","tests.hbs"]', 0);

-- Base solutions (common errors)
INSERT OR IGNORE INTO solutions (id, errorMessage, errorKeywords, cause, fixes, framework, language, source)
VALUES
  ('sol-001', 'Cannot find module or its corresponding type declarations', 'cannot find module type declarations typescript', 'Missing type definitions or wrong module path', '[{"title":"Install type definitions","code":"npm install --save-dev @types/MODULE_NAME","explanation":"Many JS packages need a separate @types package for TypeScript support."},{"title":"Check tsconfig paths","code":"// tsconfig.json\n{\n  \"compilerOptions\": {\n    \"moduleResolution\": \"bundler\",\n    \"baseUrl\": \".\"\n  }\n}","explanation":"Ensure moduleResolution is set correctly for your setup."}]', NULL, 'typescript', 'base'),
  ('sol-002', 'ENOENT: no such file or directory', 'ENOENT no such file directory node', 'File path does not exist', '[{"title":"Check relative path","code":"// Use path.join for cross-platform paths\nimport path from ''path'';\nconst filePath = path.join(__dirname, ''relative'', ''path'');","explanation":"Relative paths can differ between OS. Use path.join for reliability."}]', 'node', 'javascript', 'base'),
  ('sol-003', 'Module not found: Error: Can''t resolve', 'module not found cant resolve webpack next', 'Missing dependency or incorrect import path', '[{"title":"Install missing package","code":"npm install PACKAGE_NAME","explanation":"The imported package is not installed."},{"title":"Check import path casing","code":"// Wrong (on case-sensitive Linux)\nimport { foo } from ''./MyFile'';\n// Correct\nimport { foo } from ''./myFile'';","explanation":"Linux file systems are case-sensitive, Windows is not. Always match casing."}]', 'nextjs', 'typescript', 'base');
