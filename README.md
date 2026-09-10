# Traceback CRM

Private team CRM for Traceback, adapted from [trycompai/crm](https://github.com/trycompai/crm). Original MIT attribution remains in LICENSE.

## Sign in and invite your team

Open the CRM and sign in with your email and password. No company-domain list or Google API key is required.

For the first account, run `bun run owner:invite` against the intended database. Open the private link saved in `.scratch/owner-invite.txt`, choose **Have an invitation? Create an account**, and set a password of at least 12 characters. The first account becomes owner. This command refuses an existing user database.

Owners and admins create individual invitation links under **Settings → Members**. Share a link with its intended recipient. Each link is bound to that email, expires after seven days, and works once. The application does not send invitation emails. Invitees choose their own passwords on their own computers. Public registration is closed. Password-reset email delivery is not configured.

## Local development

Requires Bun and Node 24 for Eve, plus Postgres 17. Use one ignored `.env` at the repository root. `.env.example` documents the variables.

```sh
bun install --frozen-lockfile
bun run db:deploy
bun run db:generate
bun run dev
```

The prepared Mac installation uses an isolated Postgres cluster on `127.0.0.1:55432`. Its data directory is `~/.local/share/traceback-crm/postgres`. `.env` contains independent development and test database URLs. Do not replace these with production credentials. The web app uses port 3000, API 3001, agent 2000.

The sample seed is deliberately not run. New company data starts empty.

## Production

Three Vercel projects: `traceback-crm` (`apps/app`), `traceback-crm-api` (root with the API Build Output script), and `traceback-crm-agent` (`apps/agent`). The agent requires Node 24. Production credentials are encrypted Vercel variables, not committed files. Preview builds do not receive production credentials.

Production Postgres is the dedicated **Traceback CRM** Supabase project. Prisma accesses Postgres directly through the server connection; Supabase publishable and service-role API keys are not needed. Anonymous and authenticated Supabase API roles do not have access to CRM tables.

The three services share the production database and authentication secret. The web app proxies browser API calls on the same origin. The app, API, and agent share the bridge secret. Cron endpoints require CRON_SECRET.

The current Hobby-compatible schedules run daily: mailbox sync at 08:00 UTC and agent dispatch at 09:00 UTC. User-triggered work also dispatches through the API. Frequent background sync and scheduled team agents require a suitable Vercel plan and updated schedules. Vercel plan eligibility and usage charges remain account-level settings.

## AI and optional keys

NVIDIA inference is configured with NVIDIA_API_KEY and NVIDIA_MODEL. The research agent, builder, and runner call NVIDIA directly, with thinking disabled for reliable tool calling. The tested model is `nvidia/nemotron-3-super-120b-a12b`. No OpenAI or AI Gateway key is needed for this mode. The deployment model is fixed while NVIDIA_MODEL is set; the chooser reflects this. Requests remain subject to NVIDIA quotas.

- GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET: optional Google sign-in and Gmail/Calendar access. Register the callback on the API URL. Workspace credentials are separate from Gemini API credentials.
- PERPLEXITY_API_KEY: optional web research.
- Context key: optional enrichment, configured in Settings. It no longer blocks onboarding.
- BLOB_READ_WRITE_TOKEN: optional Vercel Blob storage for images.
- REDIS_URL: optional shared cache and shared rate counters.
- AI_GATEWAY_API_KEY: only for the alternative Gateway mode outside Vercel.

Upstream telemetry and landing analytics are disabled. The upstream telemetry key is removed. MIT attribution and upstream Git history remain intact.

## Checks

```sh
bun run db:test
bun run check-types
bun run lint
bun run lint:slop
bun run test
```

Tests use only TEST_DATABASE_URL and require a database name ending in `_test`. The pre-push hook runs the required checks.
