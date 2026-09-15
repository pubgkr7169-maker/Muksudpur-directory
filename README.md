# Muksudpur Directory

English-only, mobile-first essential numbers directory for Muksudpur. Includes calm light/dark themes, Bangladesh clock, verified-only default, calling/copy/sharing, saved numbers, password-protected admin CRUD, reports and a short community forum.

## Deploy to Vercel

1. Upload this project's contents to `pubgkr7169-maker/Muksudpur-directory`. `package.json` must be at the repository root. Do not upload `.env.local`, `node_modules`, `.next` or `work`.
2. Import that repository at https://vercel.com/new. Select Next.js, Node.js 22.x, and pnpm (lockfile included).
3. Add these **server-only environment variables**, for Production. Use a separate repository/branch and secrets for Preview if you need writable previews:

| Variable | Value |
| --- | --- |
| `STORAGE_MODE` | `github` |
| `GITHUB_REPOSITORY` | `pubgkr7169-maker/Muksudpur-directory` |
| `GITHUB_BRANCH` | `main` |
| `GITHUB_TOKEN` | Fine-grained GitHub token: only this repository; Contents read and write |
| `DATA_SECRET` | Existing 64-character secret from your local `.env.local` |
| `ADMIN_PASSWORD_SHA256` | Existing password hash from your local `.env.local` |

4. Deploy. Check directory, admin sign-in/save, and community posting on the live URL. Local tests cannot verify your GitHub token or Vercel permissions.

GitHub token setup: https://github.com/settings/personal-access-tokens/new . Choose only this repository and Contents read/write. Set an expiry you can renew. Never put the token in source code or a `NEXT_PUBLIC_` variable. The deployment needs direct writes to the data branch; a rule requiring pull requests for every change will block live edits.

## How persistence works

`data/directory.json` holds readable directory contacts and public forum suggestions. Admin changes and posts are committed through the GitHub Contents API. The API reads the latest file without a cache, so visitors see changes on refresh without waiting for a rebuild. Data-only commits skip Vercel builds through the included ignore command; code commits still deploy normally.

Reports, hashed admin sessions and rate-limit counters are AES-256-GCM encrypted in the same file. Keep `DATA_SECRET` backed up: losing/changing it prevents decrypting existing private data. The administrator password/hash and GitHub token are never stored in that file. Logout revokes the session. Simultaneous writes use GitHub SHA checks and retry, and stale admin edits return a conflict instead of overwriting someone else's work.

No separate database is required, but GitHub is still remote storage and Vercel runs server functions. This is intended for a small community directory: GitHub API/write quotas and latency apply. The file has a 750 KB safety limit; saves fail clearly when full, and existing data is preserved. Add Vercel firewall protection against abusive traffic. Per-IP daily limits are 5 suggestions and 10 reports, with 10 login attempts per hour; shared networks share limits. Do not place another proxy in front of Vercel without reviewing IP attribution.

The repository is public. Contacts and forum posts remain in Git history after removal from the website. The forum explains this before posting. Reports remain encrypted in history. Avoid publishing private phone numbers or personal information without permission.

## Local development

Use Node.js 22.13+ and pnpm. Copy `.env.example` to `.env.local`, configure `DATA_SECRET` and `ADMIN_PASSWORD_SHA256`, and keep `STORAGE_MODE=local`. The prepared local project already has its secrets; the distributable ZIP deliberately excludes them. Run `pnpm install`, then `pnpm dev`. Local writes update the JSON file atomically. Vercel refuses local storage rather than pretending a temporary write is permanent.

To generate a new secret for an empty project: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Existing encrypted data requires the original secret. Generate a password hash locally, keeping the password out of shell history, or use the already configured local hash.

## Verification

`pnpm build` and `pnpm typecheck` verify Next.js production compilation and types. `pnpm test` tests directory safety and validation. `node scripts/test-store.mjs` tests mocked GitHub conflicts, encryption and failure behavior. API tests (`scripts/test-api.mjs`, `scripts/test-forum.mjs`) require `TEST_BASE_URL` and `TEST_ADMIN_PASSWORD` and should run only against a disposable local copy: they add/remove test entries and create a test report.

National helplines have source links and verification dates. Fictional sample contacts are marked and cannot be called. Forum suggestions are not verified directory listings. Saved favorites/theme remain on each visitor's device.
