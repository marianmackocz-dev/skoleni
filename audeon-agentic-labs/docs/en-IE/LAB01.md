## 1 Agentic stack and test guided repair

Distinguish model responsibilities from the harness and repair the domain without weakening existing tests.


### Model and development harness

The model proposes an action. The harness assembles context, exposes tools, executes permitted operations and returns results. The language model itself has no direct filesystem, database or terminal access. When analysing a failure, distinguish a poor proposal, excessive tool permissions and missing verification. In DeliveryDesk the model repairs TypeScript, while the test process exit code determines success.

A proposed change, its diff and its test result are separate pieces of evidence.


### Verifiable task contract

A task specifies affected paths, required behaviour, change constraints and verification commands. Run tests before editing and record baseline failures. npm test checks the domain and HTTP behaviour using an in-memory repository. It does not validate PostgreSQL. npm run verify adds type checking and an Angular production build. Separate integration and E2E commands validate the database and browser.

NEW may advance only to IN_PROGRESS. DONE is terminal.


### Regression and characterisation tests

A characterisation test records current behaviour, which may be incorrect. A regression test expresses the required rule after a fix. During refactoring, preserve the public contract and add boundary cases. Assess assertions as well as test counts or coverage: invalid transitions, negative amounts, NaN, idempotent replay and version conflicts matter. A test that copies the implementation algorithm can repeat the same defect.

Compare the result with a business rule rather than another copy of the calculation.


### Interactive and non interactive Claude Code

Begin interactively, reviewing the plan and first diff. claude -p suits repeatable tasks with available tools, an explicit turn limit and a budget. A per-process budget does not replace an orchestration-wide budget. In unattended runs, missing permission must produce an understandable failure. Participants must not address missing authorisation by disabling permission checks globally.

Record claude --version and claude --help before running a task.


### Quick path for experienced developers

```sh

npm run lab -- starter01
npm test
claude
npm run verify
git diff -- packages/domain/workflow.ts

```


### Detailed walkthrough

1. In VS Code choose File > Open Folder, open the extracted course folder and trust only this reviewed classroom project. Choose Terminal > New Terminal and confirm that the terminal is at the root containing package.json.

2. Type npm run lab -- starter01 and press Enter. Open packages/domain/workflow.ts. Its two short functions contain deliberate defects. Leave the solution closed for now.

3. Type npm test. Expect failing transition and money tests. Record at least one failure message and expected value. A red result is the correct starting point here.

4. Type claude and sign in with your own authorised account under organisational policy. Read the trust request and available permissions. Paste the complete prompt below rather than merely asking to fix tests.

5. Before editing, ask the agent for its plan and affected files. Permit the domain change only. If it proposes changing a business rule or an existing assertion, reject that proposal and return to the specification.

6. After the repair, run npm run verify in another terminal. Open Source Control and inspect the diff. Confirm that existing tests, package.json and the lockfile remain unchanged.

7. Start the API and web using the setup guide. Open http://127.0.0.1:4200, click Advance 1 and check IN_PROGRESS. A second click reaches DONE. Record the checks you actually performed.


### Prompt

Repair only packages/domain/workflow.ts according to CLAUDE.md. Run npm test first and explain the failures. Preserve tests and contracts. Make a minimal change, run npm run verify and report exit codes and the diff.


### Acceptance

- Existing tests fail before the repair and pass afterwards.

- The diff changes only the permitted domain implementation.

- The agent reports actual commands and test limitations.


### Solution and explanation

Load the reference repair with npm run lab -- solution01. It explicitly defines both valid edges and validates and rounds amounts to cents. A financial domain accepting arbitrary decimal values would need a stricter input contract or a decimal library.


### Troubleshooting

- claude not found: complete the official installation before the course, or work manually and compare the diff.

- API returns 500: check DATABASE_URL and migrations. Without a database, explicitly use APP_STORE=memory.

- Angular type errors after npm install: use the locked npm ci and TypeScript 6.0.3 rather than the latest TypeScript 7.


### Extension outside contact time

Add a new generated test preserving the terminal state. Ask another participant to assess whether it genuinely tests the rule.
