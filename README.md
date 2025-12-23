# AI Job Analyser Monorepo

> ⚠️ Reminder: Do not input sensitive or personally identifiable information (PII) during local testing.

> ⚠️ Note: Some models have restrictive licenses. Ensure you comply with the model's license before using it. Local models may require significant CPU/GPU and RAM.

A pnpm workspace with two Next.js applications:

- `apps/consumer-app`: Public-facing job description analyser
- `apps/admin-dashboard`: Internal admin dashboard (work in progress)

## Features

- Next.js 16 + React 19
- TypeScript, ESLint, Prettier
- Vitest for unit testing
- pnpm workspaces with shared CI

## Demo

![AI Job Analyser Demo](assets/job_analyser_demo.gif)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

Optionally for local AI development:

- Ollama installed (Windows/macOS/Linux)
- A local model pulled (e.g., `mistral`)

### Install

```powershell
cd apps
pnpm install
```

### Run (consumer-app)

```powershell
cd apps/consumer-app
pnpm run dev
```

- `consumer-app`: http://localhost:3000

Admin dashboard is not yet ready to run.

### Build (consumer-app)

```powershell
cd apps/consumer-app
pnpm run build
```

### Quality Checks

```powershell
cd apps
pnpm run format      # Prettier check (non-failing)
pnpm run typecheck   # TypeScript
pnpm run lint        # ESLint
pnpm run test        # Vitest (both apps)
```

To auto-fix lint issues:

```powershell
cd apps
pnpm run lint:fix
```

## Configuration

- Prettier: `.prettierrc.json` + `.prettierignore`
- Editor: `.vscode/settings.json` and `.editorconfig`
- ESLint: `apps/*/eslint.config.mjs`
- Workspace: `pnpm-workspace.yaml`

## CI

GitHub Actions workflow at `.github/workflows/ci.yml`:

- Restore pnpm store cache
- Install dependencies
- Build both apps
- Format check, typecheck, lint
- Run tests

## Environment Variables

`consumer-app` uses environment variables for AI services. Create `.env.local` in `apps/consumer-app` depending on your mode.

#### Local development with Ollama (recommended for dev)

The app can call a local LLM via Ollama. In development (`NODE_ENV !== 'production'`), it requires a model name and base URL.

1. Install Ollama:

   - Download from https://ollama.com and install it.

2. Pull a local model via Ollama (replace `<model_name:version>` with your chosen model):

```powershell
ollama pull <model_name:version>
# Example: ollama pull mistral:latest
```

3. Configure `apps/consumer-app/.env.local`:

```
# Local dev AI
LOCAL_DEV_AI_MODEL=<model_name:version>
OLLAMA_BASE_URL=http://localhost:11434/v1
```

Start the app:

```powershell
cd apps/consumer-app
pnpm dev
```

#### Local development with OpenAI

Prefer using your OpenAI account locally? Set the provider to `openai` and use your API key. This runs dev mode against OpenAI instead of Ollama.

1. Create `apps/consumer-app/.env.local`:

```
# Use OpenAI in dev
DEV_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
LOCAL_DEV_AI_MODEL=gpt-4o-mini
```

2. Start the app:

```powershell
cd apps/consumer-app
pnpm dev
```

> Note: OpenAI usage may incur costs and requires internet access. Ensure your model selection and usage comply with OpenAI’s terms.

#### Production/remote with OpenAI

In production, the app calls OpenAI's API. Set:

```
OPENAI_API_KEY=sk-...
```

Run a production build:

```powershell
cd apps/consumer-app
pnpm build
pnpm start
```

## Project Structure

```
apps/
  consumer-app/
    app/               # Next.js routes & pages
    components/        # UI components
    lib/               # actions, services, utils
  admin-dashboard/
    app/               # Next.js routes
```

## Contributing

- Create a feature branch
- Run `pnpm run build` and `pnpm run test` before PR
- Ensure lint/typecheck pass

### Running all tests from the workspace root

```powershell
cd apps
pnpm run test
```

If you prefer per app:

```powershell
cd apps/consumer-app; pnpm test
cd ../admin-dashboard; pnpm test
```

## Licence

Proprietary — internal use only.

All rights reserved by Honghao Zheng. Commercial use by third parties is not permitted without explicit permission.

Please ensure you comply with the license terms of any models you use locally. We are not responsible for license violations.
