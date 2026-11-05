## 5 Subagents and repository wide orchestration

During the final twenty-five minutes of implementation, replace the simple error-message change with submission, validation and history review and testing from ANGULAR_AI.md. The block duration remains unchanged.

Partition work without ownership conflicts and integrate independent results with evidence.


### Subagent context and responsibility

A specialised agent needs a narrow task, inputs, tools and an output format. Separate context reduces noise but can omit a crucial shared decision. Pass the API contract, acceptance criteria and base commit. A read-only reviewer should neither edit files nor receive unnecessary tools. The main agent remains responsible for integration and verification.

A review finding includes a path, evidence and severity rather than a general opinion.


### Fan out and dependencies

API, UI and tests can be reviewed concurrently. One owner should propose a shared contract change before implementers depend on it. Build a dependency graph and assign one writer to each path. More agents do not automatically shorten the critical path. Costs include repeated context, waiting, review and conflict resolution.

Reviews can run concurrently against one commit. Two writers editing the same file need coordination.


### Worktrees and integration point

Git worktree separates working copies and branches. It does not isolate the network, credentials, database or operating system. Assign owned paths and a common integration base to each branch. During integration inspect diffs, apply selected commits and run the complete checks. Green tests in separate branches do not establish that the combined result works.

Create the UI worktree outside the original working directory.


### Subagents and agent teams

Subagents return results to a coordinator. Agent teams add different collaboration capabilities and may have version-dependent or experimental behaviour. The core course uses ordinary subagents and explicit Git branches. Use advanced teams only after verifying the actual version, permissions and shared-directory behaviour before the course.

Several readers may inspect one commit concurrently. Each writer has explicit ownership.


### Quick path for experienced developers

```sh

git status
git worktree add ../deliverydesk-ui -b lab05-ui
git worktree add ../deliverydesk-api -b lab05-api
claude
/agents

```


### Detailed walkthrough

1. Commit the work approved so far. Run git status and git log -1 --oneline. Record the common base commit for all branches.

2. Open .claude/agents and inspect the three reviewers. In Claude Code type /agents and confirm that they are loaded. Read, Glob and Grep allow inspection without editing.

3. Request parallel reviews using the prompt below. Require separate API, Angular and test findings against the same contract. If the runtime executes them sequentially, record what actually happened.

4. Create two worktrees using the quick path commands. In VS Code choose File > New Window and Open Folder for each worktree. Run npm ci in each one.

5. The UI branch improves the error message and adds a new E2E scenario. The API branch adds a new validation-error test. Preserve the shared contract and existing protected tests. Include owned paths in each branch task.

6. Each participant reviews the diff, runs relevant tests and creates a local commit. The coordinator cherry-picks specific hashes, inspects the combined diff and runs npm run verify and relevant E2E checks.

7. Write an integration report with the base commit, selected commits, affected paths and actual results. Remove worktrees only after verification and retention of the required commits.


### Prompt

Delegate read-only reviews of the current commit to api-reviewer, ui-reviewer and test-reviewer. Each must return a path, severity, evidence and proposed test. Consolidate duplicates and identify change dependencies. Do not edit files.


### Acceptance

- Every changed path has one owner.

- Reviewers only read and return evidence-based findings.

- The coordinator verifies the combined result.


### Solution and explanation

Reference reviewer definitions are in .claude/agents. Reports vary with participant changes. Assess correctness through evidence and integration tests.


### Troubleshooting

- Worktree already exists: inspect git worktree list and choose a new name.

- Cherry-pick conflict: resolve it on the integration branch and rerun checks.

- A dependent branch lacks the contract: stop implementation and establish the common commit.


### Extension outside contact time

Compare elapsed time and total cost for the same task with two and four workers.
