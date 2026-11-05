## 8 Capstone and team adoption

Deliver a database API UI and MCP change with generated tests and evidence-based handover.


### Capstone requirements

Add ticket priority LOW, NORMAL or HIGH, defaulting to NORMAL. Carry it through the database, types, API and Angular display and filtering. MCP list gains an optional priority filter while existing calls without a filter continue to work. Preserve existing data during migration. Generated tests cover defaults, invalid input, filtering and backwards compatibility.

Every acceptance criterion needs executable evidence.


### Planning and ownership

Assign schema and shared-contract ownership in the first minutes. UI and backend work can proceed concurrently once the contract is settled. The test reviewer proposes scenarios before implementation. A coordinator tracks dependencies and the integration commit. If time is short, omit extensions while retaining migration and existing regression tests.

SQL and the contract precede UI and MCP integration.


### Acceptance and handover

Handover includes changes, migration steps, test commands and outcomes, remaining limitations and rollback steps. Demonstrate the change in a browser and through MCP, including invalid input. An in-memory repository cannot establish database correctness. Mark missing evidence and make GO conditional on completing it.

The two-minute demonstration shows concrete behaviour.


### Team rollout

After the course choose a limited set of repositories and task types. Track delivery time, regression defects, review quality and cost. Assign owners for instructions, skills and MCP servers. Introduce model and tool changes through a small evaluation suite. Agent count and generated line count do not measure productivity.

The first pilot has bounded scope, an owner and a review date.


### Quick path for experienced developers

```sh

git switch -c lab08-priority
npm run verify
npm run test:db
npm run mcp:smoke
npm run test:e2e

```


### Detailed walkthrough

1. Create lab08-priority and artifacts/capstone-plan.md. List six acceptance criteria and assign owners for database and contract, API and MCP, Angular and E2E, and independent review.

2. Design 002_priority.sql with a NOT NULL default of NORMAL and an allowed-value CHECK constraint. Inspect existing data and plan repeatable application and rollback. Preserve the original migration.

3. Update the Ticket type, PostgreSQL mapping and in-memory repository. API GET list accepts an optional validated filter. Preserve existing fields and all existing tests.

4. In Angular add priority display and a select filter with an accessible label. Check empty results, loading errors and preservation of the existing state transition.

5. Extend MCP ticket_list with an optional priority enum. The old {} input must still return the list. Ask the agent to generate new tests in new files, then manually review their assertions.

6. Integrate approved commits. Run verification, database tests, MCP smoke and E2E. Distinguish PASS, FAIL and SKIPPED throughout. Demonstrate HIGH filtering in the browser and the equivalent MCP lookup.

7. Write artifacts/handover.md with migration steps, evidence and unverified conditions. Give a two-minute handover and peer assessment using the rubric.


### Prompt

Implement LOW NORMAL HIGH priority throughout DeliveryDesk according to the capstone brief. First propose the contract, migration and test scenarios. Partition changes by owned paths. Preserve existing calls. Provide actual checks and limitations before handover.


### Acceptance

- Priority works consistently across the database API UI and MCP.

- Existing data and calls remain usable.

- Each criterion has a verifiable test or demonstration.


### Solution and explanation

The complete reference implementation is in solutions/lab08/files. Apply it with node solutions/lab08/apply.mjs and restore with --restore. The script first backs up affected files. Then run db:migrate and the complete checks. Code rollback does not remove the database column. Roll back the database separately using the documented procedure.


### Troubleshooting

- Only the memory repository changed: add SQL and integration evidence.

- Filter state changes without updating the UI: inspect signals and computed values.

- MCP rejects {}: the new field must be optional.


### Extension outside contact time

Add a backwards compatible priority update with role checks and idempotency.
