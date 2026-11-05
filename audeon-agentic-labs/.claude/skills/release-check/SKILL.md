---
name: release-check
description: Verify a DeliveryDesk change and produce an evidence report before handover.
disable-model-invocation: true
---
Read CLAUDE.md and git diff. Run npm run verify without changing scripts or tests.
If API is running, run npm run mcp:smoke. Use npm run test:db only with TEST_DATABASE_URL pointing at the disposable classroom database.
Report changed files, actual commands and exit codes, uncovered behaviour and a GO or NO-GO decision.
Never equate a skipped integration test with a pass. Never commit, push or deploy in this skill.
