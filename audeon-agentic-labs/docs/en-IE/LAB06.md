## 6 Autonomous loops and independent verification

Run a bounded repair loop and demonstrate termination on success and failure.


### Loop state machine

The loop has planning, attempt, verification, completion and escalation states. Each attempt consumes a bounded time and budget. The next iteration receives a failure summary rather than unlimited logs. Success requires deterministic checks and diff review. A repeated failure, changed protected input or unavailable dependency must end automatic work.

Three attempts of eight turns allow at most 24 model turns.


### Verification independence

The agent may run checks, but its parent process runs them independently. Fingerprints detect changes to existing tests, scripts and configuration. New tests may be added while existing acceptance assertions remain protected. Fingerprinting detects changes after they occur. Production automation should keep reference tests and validators outside the agent’s writable workspace.

Agent exit code 0 alone does not establish GO.


### Budgets and stop conditions

The teaching wrapper limits iterations, turns, dollar budget and process timeout. Monetary limits depend on the CLI provider and mode, so verify them against the actual access path before training. A gateway can additionally bound tokens, concurrency and network activity. Reliable process-tree termination requires a container or supervisor, since signalling a parent may leave descendants running.

Three attempts capped at USD 2 each give a configured agent budget ceiling of USD 6.


### Reporting and audit

Retain a task identifier, base commit, protected-input fingerprints, commands, exit codes and stop reason. Logs can contain sensitive content, so store them under organisational policy and do not automatically send them outside the team. The final report distinguishes completed work from unverified conditions. Review the proposed change before committing it.

NO-GO includes a concrete next action, such as obtaining missing database access.


### Quick path for experienced developers

```sh

npm run loop -- --dry-run
npm run lab -- starter01
npm run loop
git diff
npm run verify

```


### Detailed walkthrough

1. Inspect scripts/repair-loop.mjs. Locate iteration count, timeout, claude arguments and external verification. Run npm run loop -- --dry-run. This mode must neither call a model nor modify the project.

2. Before a live run sign in and test claude -p under organisational policy. Check --max-turns and --max-budget-usd with claude --help. If a parameter is unsupported, adjust the wrapper with instructor review and record the change.

3. On a clean working branch run npm run lab -- starter01, followed by npm run loop. Inspect the separate agent log and parent verification logs in artifacts.

4. After termination open the final verification log and confirm that the wrapper produced it. Review the diff and protected files. Do not treat the agent’s word “done” as the result.

5. For a failure scenario create a new wrapper copy using an unavailable agent command. Run it and expect NO-GO or a readable error rather than endless retries. Preserve the original wrapper.

6. Review budget and elapsed time. If cloud access is unavailable, use dry-run, a manual repair and separate verification. In the report distinguish validated wrapper structure from an unexecuted model run.


### Prompt

Repair the domain defects without changing existing tests, scripts or configuration. Allow at most three attempts. End each attempt with an external npm run verify. Return NO-GO with a reason for ambiguity or an unavailable dependency.


### Acceptance

- Dry-run has no side effects.

- The parent process performs its own verification.

- Success and failure both reach a terminal state with a recorded reason.


### Solution and explanation

scripts/repair-loop.mjs is the readable reference wrapper. It does not replace a production sandbox and states its limitations. The reference domain repair remains in solutions/lab01.


### Troubleshooting

- Missing headless permission: establish the minimum required scope interactively first.

- Timeout: also confirm child-process termination. Use a container runner in production.

- A repair changed an acceptance test: stop the run and review manually.


### Extension outside contact time

Add repeated-diff detection and a structured JSON report without retaining prompts.
