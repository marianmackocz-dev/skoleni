---
paths:
  - "apps/web/**/*.ts"
---
Prefer standalone components and signals. Keep HTTP effects out of computed values. Test loading, error and empty states. Preserve accessible labels.
Apply https://angular.dev/ai/design-patterns to the AI panel.
Separate draft and submitted input. Pass the resource abortSignal to fetch.
Validate JSON at runtime and guard resource value reads with hasValue.
Deduplicate completed history by requestId. Never record partial streams as complete.
Treat network chunks as bytes, not complete JSON messages. Bound buffers and handle cancellation.
The supplied AI panel is a deterministic simulator. Do not claim actual inference or SSR verification.
