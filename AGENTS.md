# Repository Guidelines

## Project Structure & Module Organization
- Backend (Django): `src/backend/**` (apps under `src/backend/core`, settings in `src/backend/impress`).
- Frontend (Next.js/TS): `src/frontend/**` (app in `src/frontend/apps/impress`, e2e in `src/frontend/apps/e2e`, shared packages in `src/frontend/packages`).
- Realtime server: `src/frontend/servers/y-provider`.
- Mail generator: `src/mail` (built via MJML).
- Docs and ADRs: `docs/**`. Ops: `docker/`, `helm/`, `bin/`.

## Build, Test, and Development Commands
- Bootstrap dev stack (Docker): `make bootstrap` — builds images, runs migrations, seeds demo data, starts services.
- Start/stop: `make run` / `make stop` (backend + frontend), logs: `make logs`.
- Lint backend: `make lint` (ruff format/check + pylint).
- Backend tests: `make test` or `make test-back [path_or_expr]` (pytest; parallel with `make test-back-parallel`).
- Frontend tasks from `src/frontend`:
  - Dev app: `yarn app:dev`; build: `yarn app:build`.
  - Lint: `yarn lint`; tests: `yarn test`; e2e: `yarn e2e:test`.
- i18n: `make i18n-generate`, `make i18n-compile`, Crowdin sync via `make crowdin-*`.

## Coding Style & Naming Conventions
- Python: 4-space indent, type hints when reasonable. Format via `make lint` (ruff format) and keep imports ordered; fix ruff warnings before pylint.
- Django: models/serializers/views under `src/backend/core/**`; management commands in `management/commands/`.
- TypeScript/React: follow project ESLint + Prettier rules; components `PascalCase.tsx`, hooks `useXxx.ts`, tests in `__tests__` with `*.test.ts(x)`.
- Styles: run `stylelint` via frontend `yarn lint`; keep CSS modules and tokens consistent with theming docs.

## Testing Guidelines
- Backend: pytest tests live under `src/backend/**/tests/` (e.g., `src/backend/core/tests/test_models_users.py`). Prefer small, isolated tests; add regression tests for bug fixes.
- Frontend: unit tests with Jest; E2E with Playwright in `apps/e2e`. Use data-test ids where helpful.
- Run locally before pushing: `make test` and `cd src/frontend && yarn test`.

## Commit & Pull Request Guidelines
- Use clear, imperative titles; avoid “WIP” (enforced by `.gitlint`).
- Prefer Conventional Commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`) to help changelog.
- Keep titles concise; wrap body at ~120 chars; reference issues (`Fixes #123`).
- PRs include: scope/impact, steps to test, screenshots for UI, and i18n notes when applicable.

## Security & Configuration Tips
- Create env files: `make create-env-files`; never commit secrets. SOPS config: `.sops.yaml`.
- Use `bin/install-hooks.sh` to install local hooks and `make clean` to reset the repo state when needed.
