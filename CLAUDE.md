# workout-ui

React 18 + TypeScript + Vite frontend for the fitness dashboard.
**Deploys automatically via AWS Amplify on push to `main` — never deploy manually.**

## Stack
- React 18, TypeScript 5.6, Vite 5, Tailwind CSS 4
- Recharts for charts, React Router 7 for routing
- Cognito Identity JS for auth, MSW for dev mocks

## Structure
```
src/api/          # API client (client.ts) + typed hooks for all 12 endpoints
src/auth/         # Cognito auth: signIn(), signOut(), getSession(), getCurrentToken()
src/views/        # Page components (Dashboard, Login, Exercises, Weight, Nutrition, etc.)
src/components/   # Shared UI components
src/mocks/        # MSW mock handlers (only active when VITE_ENABLE_MOCKS=true)
src/config.ts     # Reads all VITE_* env vars
```

## Local Dev
```bash
npm install
npm run dev       # Vite dev server → http://localhost:5173; proxies /api/* → http://localhost:8000
```
Run `python dev_server.py` in `../workout-api` for the full local stack.
MSW mocks activate only when `VITE_ENABLE_MOCKS=true` is set explicitly. They never auto-enable.

## Build
```bash
npm run build     # tsc + vite build → dist/
```

## Testing & Verification
```bash
# Type check + build (catches TS errors and broken imports)
npm run build

# Lint
npm run lint

# Dev with MSW mocks (no API needed)
VITE_ENABLE_MOCKS=true npm run dev
```
No unit test suite exists — `npm run build` is the primary feedback signal (fails on TS errors).

## Deploy
**Push to `main` branch — Amplify CI/CD handles build and deploy automatically.**
Live URL: `https://fitness.borjavicinay.com`

## Env Vars
| Var | Local | Production |
|-----|-------|-----------|
| `VITE_API_URL` | (blank — uses Vite proxy) | `https://api.fitness.borjavicinay.com` |
| `VITE_COGNITO_USER_POOL_ID` | — | `us-east-1_PP35xsBTq` |
| `VITE_COGNITO_CLIENT_ID` | — | `r9uejpdisusps81o0c14et6qj` |
| `VITE_ENABLE_MOCKS` | `false` (set to `true` only to run without a real API) | `false` |

Production env vars are set in the `WorkoutUiAmplifyStack` CDK stack.

## Keeping Docs Current
Keep this file **short and stable**. It is read at the start of every task — bloat costs every future engineer context.

**Belongs here:** architecture overview, file/directory structure, top-level commands (build, test, deploy), env-var summary, key rules and gotchas not obvious from the code, pointers to where deeper detail lives (source files, other docs).

**Does NOT belong here:** full component prop tables, exhaustive command variations, generated names with hashes, large example payloads, anything derivable by reading the code. If you find yourself pasting a code block, link to its source file instead.

When you change something, **prefer editing an existing line over adding a new section**. If a section has grown past ~5 lines of detail, that detail probably belongs in the code or a dedicated file.
