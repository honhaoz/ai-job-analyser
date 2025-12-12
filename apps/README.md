# Apps Workspace

This workspace hosts two Next.js applications managed with pnpm workspaces:

- `consumer-app`: the working, public-facing job description analyser
- `admin-dashboard`: internal dashboard (work in progress)

## Prerequisites

- Node.js 20+
- pnpm 10+

## Install

```powershell
pnpm install
```

## Run

Run both apps (consumer-app and admin-dashboard) in parallel:

```powershell
pnpm run dev
```

Run only the consumer app (recommended while the admin dashboard is WIP):

```powershell
cd consumer-app
pnpm run dev
```

## Build

Build both apps:

```powershell
pnpm run build
```

Build only the consumer app:

```powershell
cd consumer-app
pnpm run build
```

## Quality Checks

From this `apps` folder you can run checks across both apps:

```powershell
pnpm run format      # Prettier check (non-failing)
pnpm run typecheck   # TypeScript
pnpm run lint        # ESLint
pnpm run lint:fix    # ESLint autofix
pnpm run test        # Vitest
```

## CI

The GitHub Actions workflow (`.github/workflows/ci.yml`) installs, builds, and runs checks for both applications on pull requests.

## Notes

- The admin dashboard is under active development and may not start or build reliably yet.
- The consumer app is the primary, production-focused application.
