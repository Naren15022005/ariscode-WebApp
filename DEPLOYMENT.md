# Deployment Guide

## Local Development

```bash
# Install dependencies
npx pnpm install

# Initialize database
# Navigate to http://localhost:3000/api/init in your browser

# Start dev server
cd packages/web
npx next dev
```

Then visit `http://localhost:3000`

## Docker

```bash
# Build image
docker build -t ariscode:latest .

# Run container
docker run -p 3000:3000 ariscode:latest

# Or use docker-compose
docker-compose up
```

## Vercel Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables (if needed):
   - `NEXT_PUBLIC_API_URL`: (optional, defaults to same origin)

4. Vercel will auto-detect Next.js and build from `packages/web`

## GitHub Actions CI/CD

The workflow runs:
1. **Tests**: Type checking + Unit tests (Node 20, 22)
2. **E2E**: Playwright tests on main branch
3. **Deploy**: Auto-deploy to Vercel on main branch push

Set these secrets in GitHub:
- `VERCEL_TOKEN`: Vercel API token
- `VERCEL_ORG_ID`: Your Vercel org ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Production Checklist

- [ ] Environment variables configured
- [ ] Database persistence (volume mount for Docker)
- [ ] GitHub Actions secrets set
- [ ] E2E tests passing
- [ ] Vercel deployment working
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Monitoring/logging setup (optional)
