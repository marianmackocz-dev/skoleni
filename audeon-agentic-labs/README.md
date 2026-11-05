# AudeON agentic development course

16 contact hours. 75% participant practice. Czech and Irish English.

Start with docs/cs/COURSE.md or docs/en-IE/COURSE.md. Every lab has a quick path, detailed walkthrough, acceptance checks, troubleshooting and a solution.

Angular AI Design Patterns: docs/cs/ANGULAR_AI.md and docs/en-IE/ANGULAR_AI.md. The runnable AI pattern laboratory uses an explicitly labelled deterministic simulator, not a model. It covers resource, signals, linkedSignal history, runtime JSON validation, retry, cancellation and NDJSON streaming. Labs 05 and 07 allocate practice time to these scenarios. Real local inference remains the separate Lab 07 Node agent.

Install Node 24 LTS >=24.15.0, then `npm ci`. Do not use TypeScript 7 with this Angular baseline.

The shipped workflow contains deliberate Lab 01 defects. `npm test` is expected to fail initially. Apply `npm run lab -- solution01` to load the reference repair, then `npm run verify`.

PostgreSQL setup: copy `.env.example` to `.env`, start `docker compose up -d postgres`, set DATABASE_URL in your terminal and run `npm run db:migrate`. Compose reads .env. Node scripts require variables in the terminal too.

Run API and Angular in separate terminals. Temporary fallback: APP_STORE=memory. It does not verify SQL.

`npm run test:db` requires TEST_DATABASE_URL. SKIPPED is not PASS. `npm run mcp:smoke` needs the API. `npm run test:e2e` requires a downloaded Chromium (`npx playwright install chromium`).

Reference capstone: `node solutions/lab08/apply.mjs`, `npm run db:migrate`, verify, DB, MCP and E2E checks. Restore code with `node solutions/lab08/apply.mjs --restore`. Restore does not undo the database column. On disposable training data only, remove the priority column separately if returning to the original schema.

Local inference: review model licence and image digests, set GATEWAY_KEY and LLM_MODEL both in .env and your terminal, run `docker compose --profile ai up -d --build`, download the selected model, then `npm run agent:local -- "Read ticket 1"`.

The Ollama image uses a floating tag. Freeze its verified digest before teaching. The gateway and guard are classroom examples, with limitations explained in the handbook. Claude Code uses supported Claude access; the custom local agent is a separate Node.js path.
