# Angular AI Design Patterns in DeliveryDesk

This section applies all four topic areas on the official page https://angular.dev/ai/design-patterns to the classroom project. Distinguish using an agent to develop software from embedding AI in an application. The panel provides a target for agentic refactoring rather than another compulsory framework. Its reference backend deliberately uses a deterministic simulator, explicitly labelled in the interface. The local model in Lab 07 follows a separate, genuine inference path.

## Quick path for experienced developers

```sh
npm ci
npm run lab -- solution01
npm run verify
# Terminal A, PowerShell: $env:APP_STORE='memory'
# Terminal A, WSL: export APP_STORE=memory
npm run dev:api
# Terminal B
npm run dev:web
```

Open http://127.0.0.1:4200 and the AI pattern laboratory panel. Inspect apps/web/src/ai-assistant.ts, apps/web/src/ai-stream.ts, apps/api/ai.ts and packages/domain/ai.ts. Run the example's isolated tests with `node --import tsx --test tests/ai-patterns.test.ts`. Before E2E, stop both servers with Ctrl+C. Then run `npx playwright install chromium` and `npm run test:e2e -- e2e/ai-patterns.spec.ts`.

## Placement in the two days

The course retains eight 120-minute blocks and 720 minutes of participant practice. In Lab 05 replace the simple error-message change with this task: use the final twenty-five minutes of implementation to review explicit submission, runtime validation and history. In Lab 07 use the final twenty-five minutes of implementation for streaming and its failure cases. Prepare the existing contract, working MCP connection and local inference path before this segment. The reference panel is already included, so participants need not spend time transcribing it. The instructor uses the additional slides as reference and presents only those relevant to the current checkpoint.

## Submission and reactive dependencies

draft holds the text being edited. submitted changes only when the user clicks Generate review. Its object contains the prompt and a new requestId. A new identifier allows the same text to be submitted again, whereas assigning the same string alone might not change a signal. params returns undefined before submission and after cancellation. No network request starts while typing or when the component is constructed.

```ts
draft = signal('Review ticket 1');
submitted = signal<Submission | undefined>(undefined);
submit() {
  const prompt = this.draft().trim();
  if (prompt) this.submitted.set({
    prompt, requestId: crypto.randomUUID()
  });
}
```

Parameters define reactive triggers. Other values, such as sessionId, can be read in the loader when their changes should not independently trigger requests. The server must nevertheless authorise operations using verified identity. An identifier supplied by the browser is not authoritative. Pass the resource's abortSignal to fetch. A newer submission or component destruction can cancel an earlier request. Client cancellation alone does not guarantee that an upstream model stops or that the provider stops charging.

## Structured responses and template state

AiReply defines requestId, summary, checks and the simulator mode. parseReply performs actual JSON validation. A cast such as `as AiReply` would not reject invalid data. Check the shape, lengths and matching requestId. Bound the checks array and interpolate the summary as text. Do not render model-generated HTML or call bypassSecurityTrustHtml.

computed derives the check count without a separate synchronisation variable. linkedSignal carries up to twenty completed responses into local history. It preserves the previous value during errors or re-evaluation. Deduplication by requestId prevents a reload from appending the same response twice. An unfinished stream does not enter completed-response history. This history exists only in component memory and disappears on page refresh. Persistence, personal data and retention rules would require explicit additional requirements.

## Slow services and error controls

The resource belongs to its consuming AiAssistant component. The rest of Work queue maintains separate state. A shared provider would be appropriate when several components need the same data. An unnecessary global singleton increases the risk of history crossing session boundaries. isLoading controls the indicator. Check hasValue before reading value because an errored resource can throw when its value is read. A role alert announces failure, and Retry review calls reload for the last submitted request. Editing draft does not change the retry input.

The example permits another submission while a request is pending. The resource invalidates the earlier operation. Disabling submission until completion would be an alternative product policy with different tests. Retry should not become an unbounded automatic loop. Live inference requires quotas and server-side concurrency limits. A spinner does not prove the upstream service is still working.

## Streaming through resource

stream returns a ResourceStreamItem<string> signal. A valid fragment updates `{value: text}`, while failure updates `{error: Error}`. loader and stream are alternatives for an individual resource. The example has a separate resource for each path. Catch asynchronous reader errors to avoid an unhandled Promise.

The server sends NDJSON, with one JSON message per line. Browser network chunks do not correspond to these lines or UTF-8 character boundaries. consumeNdjson therefore uses a streaming TextDecoder and a buffer for incomplete lines. parseChunk validates delta and optional done. Completion requires an explicit marker. Premature termination or invalid JSON produces an error rather than a successful result. Bound both frame and total text size, close the reader on cancellation and ignore late updates.

After the first stream value arrives, the resource can have hasValue while transmission continues. isLoading is therefore not a universal generation-completion indicator. A production interface needs a separate protocol completion flag, partial-result presentation and, where appropriate, controlled announcement frequency for screen readers. The parser checks done here. The deliberately limited classroom panel does not display a completion percentage.

## Detailed editor and browser walkthrough

1. In VS Code choose File > Open Folder and select course. Use Terminal > New Terminal and follow the quick path. In PowerShell set `$env:APP_STORE='memory'`; in WSL use `export APP_STORE=memory`. Memory mode isolates this UI lab and provides no SQL evidence.
2. In Explorer open apps/web/src/ai-assistant.ts. Locate draft, submitted and params. In the browser open F12 > Network and filter for `/api/ai/`. Type `Review ticket 2` into Review prompt. No AI request should leave the browser yet.
3. Click Generate review. Expect Generating review, followed by Mode simulated, three checks and one history entry. In Network open summary > Payload and inspect prompt and requestId. In Response inspect JSON rather than HTML. This is not a model response.
4. Without editing the text, click Generate review again. A second request has a different requestId and history contains two entries. Now type `[fail]` and click Generate review. Expect HTTP 503, a readable error and Retry review. Edit the draft but click Retry review: it still resubmits the last submitted `[fail]`. Only Generate review submits the new text.
5. Enter `Review ticket 1` and click Stream review. In Network open stream > Response and observe NDJSON arriving. Click Cancel requests during transmission. Old content must not reappear after cancellation.
6. Enter `[broken]` and click Stream review. After several fragments the server sends invalid JSON. The interface must show an error and Retry stream. Open ai-stream.ts and identify the rejection point. Partial text must not become a completed-history entry.
7. Run the isolated Node test from the quick path. It splits Czech UTF-8 text byte by byte, rejects malformed messages and premature termination, and checks cancellation of a pending reader. These tests validate the parser and HTTP rather than Angular rendering.
8. Stop manually running API and Angular processes with Ctrl+C. Run the browser tests from the quick path on a computer or CI runner permitted to launch Chromium. If the environment denies Chromium's sockets, report BLOCKED with the reason. Do not turn the tests into PASS or disable the security policy.

## Development agent task

Perform a read-only review of apps/web/src/ai-assistant.ts and ai-stream.ts. Map all four areas of the official Angular AI design-patterns page to concrete files. Propose one stale-response test and one history-on-reload test. Preserve protected tests and their assertions. Add any new test in a new file. Introduce no browser credentials, additional AI SDK or invented inference results. Distinguish parser, HTTP, build and actual browser-run evidence in the report.

## Acceptance and instructor running order

The participant demonstrates zero requests while typing, a new identifier on repeated submission and the correct retry input. They explain the distinction between a type and a validator, and between the first stream value and completion. They demonstrate history retention on error and cancellation of an old stream. An independent reviewer assesses assertions rather than test counts. Findings contain a precise path, line or symbol, evidence and impact. The first five-minute demonstration shows the successful path. The second shows only `[broken]` and the parser. Participants use the rest of the allocated segment for their own work.

## SSR hydration and an adapter for a real SDK

The official page discusses SSR, hydration and deferred AI loading. DeliveryDesk is deliberately a SPA. SSR is neither implemented nor tested here. In an SSR variant, keep user-specific inference outside public caches and prevent duplicate server and hydration requests. Show a placeholder before the first user action. For an actual SSR application follow the current SSR and incremental hydration guides. Adding `@defer` to a SPA does not create hydration. Check HTML with JavaScript disabled, exactly one request after hydration, and absence of another user's content in caches.

The page demonstrates Genkit runFlow and streamFlow with Gemini. A custom resource loader can call another SDK similarly; httpResource is another option for ordinary HTTP reads. Our POST simulator uses fetch with explicit cancellation. A live SDK must sit behind the Node backend, validate structured output and propagate cancellation upstream. Server streaming must translate provider events into the selected browser protocol, handle backpressure and close connections. The classroom gateway for the local agent accepts only stream:false, so this NDJSON stream cannot be connected to it unchanged. Replacing the simulator with an LLM needs a separate integration test, limits and a licensing check for the chosen model.

## Sources and coverage

- Complete Angular AI Design Patterns page: https://angular.dev/ai/design-patterns
- Resource, params, abortSignal and stream: https://angular.dev/guide/signals/resource
- linkedSignal and previous: https://angular.dev/guide/signals/linked-signal
- Stream item type: https://angular.dev/api/core/ResourceStreamItem
- SSR and incremental hydration: https://angular.dev/guide/incremental-hydration

All four sections of the requested page are covered. The Genkit example is explained as an adapter alternative, not presented as an installed dependency. VERIFICATION.md records actual execution and limitations.
