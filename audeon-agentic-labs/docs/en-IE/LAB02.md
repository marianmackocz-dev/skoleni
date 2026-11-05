## 2 Context Skills and auto memory

Design versioned context and a reusable procedure, test their effect and define memory lifetimes.


### Knowledge by purpose

CLAUDE.md holds team rules and concise project orientation. Path scoped rules add Angular or database guidance when working in that area. A skill describes a repeatable procedure with a clear output. MCP adds data sources and actions. A hook reacts to an event. Every instruction needs an owner and a reason to exist. Avoid maintaining conflicting copies of the same rule.

Business transitions are project rules. release-check is a procedure.


### Loading and testing skills

The name and description must identify when to use the procedure. Its body specifies inputs, steps, checks and constraints. Keep lengthy references in supporting files. release-check uses manual invocation with disable-model-invocation. Test it against both a successful change and a deliberately broken project. A GO report after a failed build is a skill defect, however persuasive it sounds.

The same input should trigger the same checks even when the wording of the explanation varies.


### Memory and authority

Auto memory helps carry useful observations between sessions. Its contents can become stale or result from an incorrect generalisation. After review, promote a binding team rule into a versioned file. Store no secrets, personal data or unverified assumptions. Test how a fresh session uses an observation and how it behaves after the observation is removed.

“These tests require a running API” is a verifiable observation. A database password does not belong in memory.


### Context evaluation set

Create short evaluation tasks covering procedure selection, rejection of a protected-file change, an honest skipped-test report and discovery of an Angular rule. Specify the expected and forbidden action for each case in advance. Record instruction versions, results and actual cost. The mere presence of SKILL.md does not prove that the agent used it correctly.

Define evaluation criteria before changing instructions.


### Quick path for experienced developers

```sh

claude
/context
/memory
/release-check

```


### Detailed walkthrough

1. In Explorer open CLAUDE.md and identify facts, commands and procedural instructions. Move a lengthy procedure into a skill that can be evaluated independently.

2. Open .claude/rules/angular.md and inspect paths and the exact glob. Ask the agent to analyse apps/web/src/main.ts and use /context to inspect loaded context.

3. Open .claude/skills/release-check/SKILL.md. Inspect its frontmatter and add an explicit report format: file, command, exit code and unverified behaviour. Save with Ctrl+S.

4. In Claude Code type /release-check. If the command is unavailable, start a fresh session at the project root and check the exact filename. Compare its report with the actual terminal output.

5. Type /memory and inspect available files and auto memory status. Ask it to remember a harmless observation: MCP smoke requires a running API. Verify the actual saved record rather than a verbal promise.

6. End the session, start claude again and ask for the MCP smoke prerequisite. Remove the experimental observation through /memory and repeat. Record the distinction between personal memory and a team rule.

7. On the working branch run npm run lab -- starter01, invoke /release-check and require NO-GO. Then restore npm run lab -- solution01. Save both outcomes as an evaluation case.


### Prompt

Run /release-check. Mark each check PASS, FAIL or SKIPPED. Never report a skipped test as a pass. Do not commit or deploy.


### Acceptance

- The skill distinguishes a pass, failure and skipped check.

- A fresh session demonstrates both retention and removal.

- A team rule is versioned and has an owner.


### Solution and explanation

Reference files are in CLAUDE.md, .claude/rules and .claude/skills. Assess actual outcomes against two project states rather than instruction length.


### Troubleshooting

- Skill does not run: check the project root, SKILL.md and description.

- Memory disabled by policy: perform the exercise with a project file and record the limitation.

- Memory was not saved: inspect /memory and explicitly request a harmless observation.


### Extension outside contact time

Measure false GO reports and compare two descriptions against identical tasks.
