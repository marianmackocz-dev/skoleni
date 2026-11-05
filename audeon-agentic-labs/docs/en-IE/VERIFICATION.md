# Verification performed

Status dated 29 October 2026.

- npm ci and locked dependency installation: PASS.
- Lab 01 reference repair including the Angular AI panel: type checking, fourteen domain, HTTP and parser tests, and Angular production build PASS.
- The initial starter contains deliberate Lab 01 defects. Its red tests do not indicate a packaging error.
- Reference capstone: type checking, sixteen tests, and Angular production build PASS.
- MCP: actual stdio connection, discovery, valid API lookup and invalid-input rejection PASS.
- Guard: a protected path was denied and a new generated test was permitted PASS.
- Repair wrapper: syntax and dry-run PASS. A live Claude run was not performed.
- E2E: four scenarios were discovered, including two new Angular AI panel cases. A live attempt with Chrome 156.0.8078.4 failed because the environment denies its internal socket. Status BLOCKED rather than PASS. Execute on an authorised local computer or CI runner.
- The AI panel uses an explicitly labelled deterministic simulator. Its HTTP contract, byte-split UTF-8 reconstruction, malformed and prematurely ended streams, and reader cancellation passed. This does not replace UI or actual inference testing.
- PostgreSQL tests: not run against a live server. They correctly report SKIPPED without TEST_DATABASE_URL.
- Docker Compose, the Ollama model and real inference through the gateway: not exercised live.

Run the complete preflight on the classroom environment before delivery. SKIPPED is not PASS. The supplied baseline deliberately contains the Lab 01 domain defects. Load the reference with npm run lab -- solution01.

A retry loaded the AudeON site directly. Its logo is byte-for-byte identical to the asset used. CSS confirms #3d3c3f, #b9a400 and white. The materials use Office compatible Arial in place of the website font Fedra Sans Display.
