# XBrain Architecture — Future Platform Boundaries

**Status of this document:** forward-looking architecture definition. This
repository is the **public flagship frontend only**. None of the services
below exist in this codebase, and nothing here should be read as implemented.
The flagship's job is to tell this story truthfully and to keep clean seams
(`src/lib/ecosystem.ts`, `src/lib/assessment.ts`) where the platform will
eventually connect.

## Position

XBrain is HorizonX's central intelligence layer — company-owned
infrastructure. Its strategic principles originate from the founder's
digitalization methodology and accumulated business knowledge, converted into
durable company assets. It is not a personal assistant, and it is not the
client-facing XAI product (XAI *deploys* AI capabilities for client
businesses; XBrain orchestrates the HorizonX network itself).

XBrain is **not** architected around any single AI provider. The defensible
assets are the unified business data model, the digitalization methodology,
the decision engine, the cross-product execution network, measured outcomes,
and the evaluation/governance layer — not any one model underneath them.

## Planned components

```
                        ┌───────────────────────────┐
                        │       HorizonX Core        │
                        │  accounts · tenants · RBAC │
                        └────────────┬───────────────┘
                                     │
     ┌───────────────┬───────────────┼────────────────┬──────────────┐
     │               │               │                │              │
┌────▼─────┐   ┌─────▼──────┐  ┌─────▼─────┐   ┌──────▼─────┐  ┌─────▼─────┐
│ Business │   │ Digitaliza-│  │  XBrain   │   │  Product   │  │ Learning &│
│  Memory  │   │ tion Graph │  │  Engine   │   │Orchestrator│  │ Evaluation│
└──────────┘   └────────────┘  └───────────┘   └────────────┘  └───────────┘
```

- **HorizonX Core** — unified accounts, multi-tenant boundaries, RBAC.
- **Business Memory** — the per-tenant unified business data model: brand,
  audience, operations, outcomes. Strictly tenant-isolated.
- **Digitalization Graph** — each business's position on the 0–100% index,
  what exists, what is missing, and how its systems connect.
- **Digitalization Engine (XBrain)** — evaluates the graph against the
  methodology and ranks next-best actions. Starts rules-based (the public
  assessment's `AssessmentResult` contract is its seed); grows toward
  retrieval and model-assisted reasoning behind the model gateway.
- **Product Orchestrator** — activates work in Xability / XSite / XApps /
  XAuto / XAI through **product adapters** (a stable interface per product,
  so products evolve independently).
- **Learning & evaluation loop** — measured outcomes return as structured
  data; evaluation services score recommendation quality; approved
  experiments run under explicit criteria.
- **Model gateway** — routes between AI models (any provider), rules-based
  logic, retrieval systems, evaluation services, and deterministic workflows.
  No product messaging or architecture may hardcode a single provider.
- **Human approval boundaries** — recommendations above defined impact
  thresholds require human approval before execution. XBrain never rewrites
  or deploys itself; changes to its logic ship through normal engineering
  review.
- **Audit requirements** — every recommendation, activation, approval, and
  outcome is logged with actor, tenant, time, and rationale.
- **Data privacy & isolation** — tenant data never crosses tenant
  boundaries; client data is never used to train shared models without
  explicit consent; regional data-residency requirements are respected.

## What requires backend infrastructure (not this repository)

Server-controlled HTTP headers · authenticated investor data room · secure
form processing · rate limiting · secret management · backend authorization ·
business-memory persistence · AI model credentials · XBrain execution
services · multi-tenant isolation · billing · CRM.

## Seams already prepared in the flagship

| Seam | File | Future consumer |
|---|---|---|
| Ecosystem config (URLs, statuses) | `src/lib/ecosystem.ts` | Core routing / status service |
| Assessment contract (`AssessmentResult`) | `src/lib/assessment.ts` | XBrain recommendation API |
| Investor contact destination | `src/lib/ecosystem.ts` | Data-room / CRM intake |
| Per-route metadata | `src/lib/usePageMeta.ts` | Server-side rendering, if ever adopted |
