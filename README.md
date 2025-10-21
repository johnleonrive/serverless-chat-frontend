# Serverless Chat Frontend

CPSC 465 Project - Real-time serverless chat application frontend built with Next.js 14, TypeScript, and AWS WebSockets.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Validation**: Zod
- **Date Handling**: date-fns
- **Testing**: Vitest + React Testing Library
- **Build**: Static export to S3 + CloudFront
- **CI/CD**: GitHub Actions

## Project Structure

```
serverless-chat-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing/login page
│   │   ├── chat/page.tsx       # Main chat page
│   │   └── rooms/[id]/page.tsx # Dynamic room routes
│   ├── components/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageInput.tsx
│   │   ├── Sidebar.tsx
│   │   └── ConnectionStatus.tsx
│   ├── lib/
│   │   ├── ws.ts               # WebSocket manager
│   │   └── store.ts            # Zustand store
│   ├── types/
│   │   └── message.ts          # Zod schemas
│   └── styles/
│       └── globals.css
├── .github/workflows/
│   ├── ci.yml                  # CI pipeline
│   └── deploy.yml              # CD pipeline
└── vitest.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- AWS account (for deployment)
- GitHub account (for CI/CD)

### Local Development

1. **Clone and install dependencies:**

```bash
git clone https://github.com/johnleonrive/serverless-chat-frontend.git
cd serverless-chat-frontend
npm install
```

2. **Set up environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and add your WebSocket URL:

```bash
NEXT_PUBLIC_WS_URL=wss://your-api-id.execute-api.us-west-2.amazonaws.com/prod
NEXT_PUBLIC_STAGE=dev
```

3. **Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
# Run tests once
npm run test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# Type checking
npm run typecheck

# Linting
npm run lint
```

## Build & Export

```bash
# Build and export static site
npm run export

# Preview the build locally
npm run preview
```

The static files will be in the `out/` directory.

## Deployment

### Manual Deployment

1. Build and export:

```bash
npm run export
```

2. Sync to S3:

```bash
aws s3 sync out/ s3://YOUR_S3_BUCKET_NAME --delete
```

3. Invalidate CloudFront:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_CLOUDFRONT_DIST_ID --paths "/*"
```

### Automated Deployment (GitHub Actions)

The project includes CI/CD pipelines:

- **CI** (`.github/workflows/ci.yml`): Runs on all PRs and pushes to `main`
  - Type checking
  - Linting
  - Tests
  - Build verification

- **CD** (`.github/workflows/deploy.yml`): Runs on pushes to `main`
  - Builds and exports
  - Syncs to S3
  - Invalidates CloudFront cache

#### Setup GitHub Secrets & Variables

**Secrets** (Settings → Secrets and variables → Actions → New repository secret):

```bash
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
NEXT_PUBLIC_WS_URL=wss://your-api-id.execute-api.us-west-2.amazonaws.com/prod
```

**Variables** (Settings → Secrets and variables → Actions → Variables):

```bash
AWS_REGION=us-west-2
WEB_BUCKET=your-s3-bucket-name
CF_DIST_ID=your-cloudfront-distribution-id
```

Or use GitHub CLI:

```bash
gh secret set AWS_ACCESS_KEY_ID --body "YOUR_AWS_ACCESS_KEY"
gh secret set AWS_SECRET_ACCESS_KEY --body "YOUR_AWS_SECRET_KEY"
gh secret set NEXT_PUBLIC_WS_URL --body "wss://your-api.execute-api.us-west-2.amazonaws.com/prod"
gh variable set AWS_REGION --body "us-west-2"
gh variable set WEB_BUCKET --body "your-bucket-name"
gh variable set CF_DIST_ID --body "E1234567890ABC"
```

## Scripts

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start development server         |
| `npm run build`      | Build for production             |
| `npm run export`     | Build and export static site     |
| `npm run preview`    | Preview production build locally |
| `npm run typecheck`  | Run TypeScript type checking     |
| `npm run lint`       | Run ESLint                       |
| `npm run test`       | Run tests once                   |
| `npm run test:watch` | Run tests in watch mode          |

## Configuration

- **TypeScript**: `tsconfig.json` - Strict mode enabled
- **Tailwind**: `tailwind.config.ts`
- **Next.js**: `next.config.mjs` - Configured for static export
- **ESLint**: `.eslintrc.json`
- **Prettier**: `.prettierrc`
- **Vitest**: `vitest.config.ts`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Vitest Documentation](https://vitest.dev/)
- [AWS API Gateway WebSocket](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html)

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT
