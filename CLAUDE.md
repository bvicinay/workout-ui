# workout-ui

React 18 + TypeScript + Vite frontend for the fitness dashboard.
**Deploys automatically via AWS Amplify on push to `main` — never deploy manually.**

## Stack
- React 18, TypeScript 5.6, Vite 5, Tailwind CSS 4
- Recharts for charts, React Router 7 for routing
- Cognito Identity JS for auth, MSW for dev mocks

## Structure
```
src/api/          # API client (client.ts) + typed hooks for all 10 endpoints
src/auth/         # Cognito auth: signIn(), signOut(), getSession(), getCurrentToken()
src/views/        # Page components (Dashboard, Login, Exercises, etc.)
src/components/   # Shared UI components
src/mocks/        # MSW mock handlers (auto-enabled in dev if no VITE_API_URL)
src/config.ts     # Reads all VITE_* env vars
```

## Local Dev
```bash
npm install
npm run dev       # Vite dev server; proxies /api/* → http://localhost:8000
```
Run `python dev_server.py` in `../workout-api` for the full local stack.
MSW mocks activate automatically if `VITE_API_URL` is not set and `VITE_ENABLE_MOCKS=true`.

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
| `VITE_ENABLE_MOCKS` | `true` | `false` |

Production env vars are set in the `WorkoutUiAmplifyStack` CDK stack.

## Keeping Docs Current
You are responsible for keeping this `CLAUDE.md` up to date. When you add pages, change API integration points, add env vars, or alter the component structure — update the relevant sections here before finishing the task.
