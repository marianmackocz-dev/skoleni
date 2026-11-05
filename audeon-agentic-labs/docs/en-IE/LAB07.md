## 7 On premise inference and a local agent

Use the final twenty-five minutes of implementation for streaming, cancellation and failure cases from ANGULAR_AI.md. Establish the basic local inference path first. The UI simulator and actual model are separate paths and must remain distinct in the report.

Connect a Node.js agent to local inference and MCP and demonstrate its data flows.


### Two execution paths

The cloud path uses Claude Code with authorised access to Claude models. The local path uses a Node.js client, Ollama and the same read-only MCP tools. Gateway protocol compatibility does not establish Claude Code support for arbitrary models. Keeping data within a perimeter requires local inference, tools, repositories, logs, memory and network dependencies.

The custom local agent does not require a Claude login.


### Inference and gateway

Ollama provides a straightforward classroom inference service. The Node.js gateway forwards a selected operation and model, checks a key and logs metadata without prompts. It is intended for loopback use and does not replace production API management. For shared GPUs consider vLLM, queues, quotas, concurrency control and observability. Validate the actual model, quantisation, context size and tool-calling support.

Download the model and images before class and record their digests.


### Tool calling in the local loop

The agent sends descriptions of permitted MCP tools to the model. The SDK validates proposed calls and the runner rejects unknown names. Results return as tool-role messages. The loop limits turns, calls per turn, result size and inference timeout. A fluent answer without an actual lookup does not satisfy a request for the ticket’s current state.

An unknown tool causes TOOL_NOT_ALLOWED rather than an inferred shell command.


### Deployment preparation and measurement

Measure time to first result, total task duration, tool errors and acceptance-scenario success. Performance depends on hardware and model, so classroom assumptions are not production sizing. For disconnected networks prepare packages, images, weights, licences, certificates and internal DNS. Test restart and inference failure. Logs and memory need retention and deletion policies.

Evaluate the same question against the manually verified API state.


### Quick path for experienced developers

```sh

docker compose --profile ai up -d --build
docker compose exec ollama ollama pull qwen3:8b
npm run agent:local -- "Read ticket 1 and explain its next legal state"

```


### Detailed walkthrough

1. Confirm the pre-course model download and licence review. As a classroom planning assumption allow 32 GB RAM and sufficient space for images and the model. A shared instructor endpoint can replace a weak laptop. Verify capacity with an actual run.

2. Set GATEWAY_KEY to at least 16 characters and LLM_MODEL=qwen3:8b in .env. Also set them with export or $env in the terminal running the Node agent. Do not paste the key into chat.

3. Run docker compose --profile ai up -d --build. Inspect docker compose ps and gateway logs. Download the model with docker compose exec ollama ollama pull qwen3:8b. Complete this before the timed lab if the network is slow.

4. Leave the host API running. In another terminal run npm run agent:local -- "Read ticket 1 and explain its next legal state". The agent launches MCP as a local child process and calls inference through port 4000.

5. Open local/agent.ts. Locate the name allowlist, five-turn limit, four-call-per-turn limit and timeout. Compare the answer with GET /api/tickets/1 in a browser.

6. Set an incorrect GATEWAY_KEY in the terminal and retry. Expect 401. Restore the correct key, stop Ollama and verify a readable error or timeout without an infinite loop.

7. Draw data flows between Angular, API, PostgreSQL, the Node agent, MCP, gateway and Ollama. Label pre-course downloads and runtime traffic. State what changes with a shared TLS endpoint.


### Prompt

Fetch ticket 1 through a tool. Report its actual status and next legal transition. If data is unavailable, state which check could not be completed.


### Acceptance

- The local model calls an allowed MCP tool and its answer matches the API.

- An invalid key and inference outage end in controlled errors.

- The report describes actual runtime data flows.


### Solution and explanation

The complete solution is in local/agent.ts, local/gateway.ts, mcp and compose.yaml. It uses no cloud model, but initial setup needs prepared dependencies and weights.


### Troubleshooting

- Model does not call tools: verify model and API tool-calling support rather than only text generation.

- Out of memory: select a smaller validated model or shared inference.

- Container gateway is unreachable: check GATEWAY_BIND, port and matching key in the host terminal.


### Extension outside contact time

Replace inference with a validated vLLM endpoint and compare task success as well as tokens per second.
