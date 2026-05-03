import { Pattern, PatternPriority } from '@ariscode/shared';

export const SEED_PATTERNS: Pattern[] = [
  {
    id: 'seed-hello-world',
    name: 'Hello World',
    description: 'Simple hello world starter template',
    framework: 'vanilla',
    language: 'typescript',
    category: 'starter',
    template: `console.log('Hello {{name}}!')`,
    config: {},
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
  {
    id: 'seed-nestjs-crud',
    name: 'NestJS CRUD Module',
    description: 'Complete CRUD module with controller, service, and entity',
    framework: 'nestjs',
    language: 'typescript',
    category: 'api',
    template: `import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { {{pascalcase name}}Service } from './{{kebabcase name}}.service';

@Controller('{{kebabcase name}}')
export class {{pascalcase name}}Controller {
  constructor(private readonly service: {{pascalcase name}}Service) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.service.create(createDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}`,
    config: {
      variables: [
        { name: 'name', type: 'string', required: true, description: 'Module name' },
      ],
    },
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
  {
    id: 'seed-react-component',
    name: 'React Functional Component',
    description: 'TypeScript React functional component with hooks',
    framework: 'react',
    language: 'typescript',
    category: 'component',
    template: `import React from 'react';

interface {{pascalcase name}}Props {
  // Add your props here
}

export const {{pascalcase name}}: React.FC<{{pascalcase name}}Props> = () => {
  const [state, setState] = React.useState<any>(null);

  React.useEffect(() => {
    // Add side effects here
  }, []);

  return (
    <div>
      <h1>{{pascalcase name}}</h1>
      {/* Add your JSX here */}
    </div>
  );
};

export default {{pascalcase name}};`,
    config: {
      variables: [
        { name: 'name', type: 'string', required: true, description: 'Component name' },
      ],
    },
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
  {
    id: 'seed-nextjs-page',
    name: 'Next.js App Router Page',
    description: 'Next.js 14 App Router page component with metadata',
    framework: 'next',
    language: 'typescript',
    category: 'page',
    template: `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '{{pascalcase name}}',
  description: 'Page for {{pascalcase name}}',
};

export default function {{pascalcase name}}Page() {
  return (
    <main>
      <h1>{{pascalcase name}}</h1>
      {/* Page content goes here */}
    </main>
  );
}`,
    config: {
      variables: [
        { name: 'name', type: 'string', required: true, description: 'Page name' },
      ],
    },
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
  {
    id: 'seed-express-router',
    name: 'Express Router',
    description: 'Express router with GET, POST, PUT, DELETE handlers',
    framework: 'express',
    language: 'typescript',
    category: 'api',
    template: `import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Get all {{lowercase name}}' });
});

router.get('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Get {{lowercase name}} by id', id: req.params.id });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Create {{lowercase name}}', data: req.body });
});

router.put('/:id', (req: Request, res: Response) => {
  res.json({ message: 'Update {{lowercase name}}', id: req.params.id, data: req.body });
});

router.delete('/:id', (req: Request, res: Response) => {
  res.status(204).send();
});

export default router;`,
    config: {
      variables: [
        { name: 'name', type: 'string', required: true, description: 'Resource name' },
      ],
    },
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
  {
    id: 'seed-laravel-controller',
    name: 'Laravel Controller',
    description: 'Laravel resource controller with CRUD actions',
    framework: 'laravel',
    language: 'php',
    category: 'api',
    template: `<?php

namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;

class {{pascalcase name}}Controller extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'List all {{lowercase name}}']);
    }

    public function store(Request $request)
    {
        return response()->json(['message' => 'Create {{lowercase name}}'], 201);
    }

    public function show($id)
    {
        return response()->json(['message' => 'Get {{lowercase name}}', 'id' => $id]);
    }

    public function update(Request $request, $id)
    {
        return response()->json(['message' => 'Update {{lowercase name}}', 'id' => $id]);
    }

    public function destroy($id)
    {
        return response()->json(['message' => 'Delete {{lowercase name}}'], 204);
    }
}`,
    config: {
      variables: [
        { name: 'name', type: 'string', required: true, description: 'Controller name' },
      ],
    },
    priority: PatternPriority.BASE,
    createdAt: 0,
    updatedAt: 0,
    userModified: false,
    updateAvailable: false,
  },
];
