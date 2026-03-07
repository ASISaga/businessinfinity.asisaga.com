# BusinessInfinity Repository Specification

**Version**: 1.0.0  
**Status**: Active  
**Last Updated**: 2026-03-07

## Overview

BusinessInfinity is a lean Azure Functions application that delegates all agent orchestration, Service Bus communication, authentication, and deployment scaffolding to the **`aos-client-sdk`**. The application contains only business logic — expressed as workflow functions decorated with `@app.workflow`.

## Scope

- Repository role in the AOS ecosystem
- Technology stack and coding patterns
- Testing and validation workflows
- Key design principles for agents and contributors

## Repository Role

| Concern | Owner |
|---------|-------|
| Business workflows (strategic review, market analysis, budget approval, etc.) | **BusinessInfinity** |
| Azure Functions scaffolding, HTTP/Service Bus triggers, auth | `aos-client-sdk` |
| Agent lifecycle, perpetual orchestration, messaging, storage, monitoring | AOS |
| Agent catalog (C-suite agents, capabilities) | RealmOfAgents |

BusinessInfinity **knows nothing about agent internals**. It calls `start_orchestration` / `submit_orchestration` and lets AOS handle the rest.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Python 3.10+ |
| App framework | `aos-client-sdk[azure]` — `AOSApp` / `WorkflowRequest` |
| Hosting | Azure Functions (provisioned by SDK) |
| Messaging | Azure Service Bus (provisioned by SDK) |
| Tests | `pytest` + `pytest-asyncio` |
| Linter | `pylint` |
| Build / deploy | `azure.yaml` (Azure Developer CLI) |

## Directory Structure

```
business-infinity/
├── src/
│   └── business_infinity/
│       ├── __init__.py
│       └── workflows.py       # @app.workflow decorators — all business logic lives here
├── tests/
│   └── test_workflows.py      # pytest unit tests
├── function_app.py            # Azure Functions entry point: app.get_functions()
├── pyproject.toml             # Build config, dependencies, pytest settings
└── azure.yaml                 # Azure Developer CLI deployment config
```

## Core Patterns

### Workflow Definition

```python
from aos_client import AOSApp, WorkflowRequest

app = AOSApp(name="business-infinity")

@app.workflow("workflow-name")
async def my_workflow(request: WorkflowRequest) -> dict:
    agents = await request.client.list_agents()
    status = await request.client.start_orchestration(
        agent_ids=[a.agent_id for a in agents],
        purpose="Describe the perpetual goal",
        context=request.body,
    )
    return {"orchestration_id": status.orchestration_id, "status": status.status.value}
```

### Perpetual Orchestrations

All orchestrations are **perpetual and purpose-driven** — agents work toward the purpose indefinitely. There is no finite completion.

```python
status = await request.client.start_orchestration(
    agent_ids=agent_ids,
    purpose="Drive strategic review and continuous organisational improvement",
    purpose_scope="C-suite strategic alignment and cross-functional coordination",
    context=request.body,
)
```

### C-Suite Agent Selection

```python
# Prefer explicit IDs; fall back to type-based selection
all_agents = await client.list_agents()
by_id = {a.agent_id: a for a in all_agents}
selected = [by_id[aid] for aid in C_SUITE_AGENT_IDS if aid in by_id]
```

## Testing Workflow

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run all tests
pytest tests/ -v

# Lint
pylint src/business_infinity/

# Specific test
pytest tests/test_workflows.py -v -k "test_workflows_registered"
```

**CI**: GitHub Actions runs `pytest` across Python 3.10, 3.11, and 3.12 on every push/PR to `main`.

→ **CI workflow**: `.github/workflows/ci.yml`

## Related Repositories

| Repository | Role |
|-----------|------|
| [aos-client-sdk](https://github.com/ASISaga/aos-client-sdk) | Client SDK & App Framework |
| [aos-dispatcher](https://github.com/ASISaga/aos-dispatcher) | AOS Orchestration API |
| [aos-realm-of-agents](https://github.com/ASISaga/aos-realm-of-agents) | Agent catalog (C-suite) |
| [aos-kernel](https://github.com/ASISaga/aos-kernel) | OS kernel |

## Key Design Principles

1. **Zero boilerplate** — No Azure Functions scaffolding in this repo
2. **Purpose-driven** — Orchestrations are perpetual; describe *why*, not *how*
3. **SDK-delegated** — All infrastructure concerns belong to `aos-client-sdk`
4. **Business-only** — Only business logic lives here; no agent internals

## References

→ **Agent framework**: `.github/specs/agent-intelligence-framework.md`  
→ **Conventional tools**: `.github/docs/conventional-tools.md`  
→ **Python coding standards**: `.github/instructions/python.instructions.md`  
→ **Azure Functions patterns**: `.github/instructions/azure-functions.instructions.md`
