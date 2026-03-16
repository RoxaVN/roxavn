---
name: readme-writer
description: Writes or rewrites module README.md "Flow" sections by reading the codebase and summarizing main flows in a consistent, high-level style. Use when the user asks to update the README, document main flows, or summarize the logic for a module.
---

# README Writer (Module Flow)

## Goal

Produce a high-signal `## Flow` section for a Roxavn module README by inspecting code and editing the target module's `README.md` directly in a concise, structured format.

## When to use

- The user asks to "read code to summarize the main flow" or "rewrite the README".
- A module has an outdated or missing `## Flow` section.

## AI Assistant Instructions (Workflow)

Follow these steps in order:

### 1) Find the style reference

- Prefer a structure with `## Flow` and multiple `###` subsections.
- Each subsection should explain what it does and roughly where it is implemented (APIs/services/hooks/UI), in a concise and concrete way.

### 2) Inspect the module like a product surface

Assume a standard Roxavn module layout. Read only what you need, but cover:

- **Entrypoints**
  - `README.md` (current state)
  - `src/base/index.ts`
  - `src/server/index.ts`
  - `package.json` (exports: base/server/web)
- **Access / auth**
  - `src/base/access.ts` (scopes/permissions/roles/policies)
- **APIs**
  - `src/base/apis/*.ts` (what endpoints exist and what policies they enforce)
- **Server behavior**
  - `src/server/services/*.ts` (actual business rules, validations, transitions, derived fields)
  - `src/server/hooks/*.ts` (seed, jobs, integration points)
  - `src/server/migrations/*` only to learn tables/concepts (don't document column-by-column)
- **Web UX**
  - `src/web/admin/*`, `src/web/me/*`, `src/web/init/*` (major pages, gating, editor registrations)

Output should reflect *behavior*, not file inventories.

### 3) Extract "main flows"

Turn code into 4–8 flow bullets (as `###` sections). Typical module-flow buckets:

- **Access / permissions** (scope roles, membership gating, public-read exceptions)
- **Core resource lifecycle** (create/update/delete, derived resources, invariants)
- **State machine** (status transitions, locks, constraints)
- **Aggregation / computed views** (reports, totals, rollups)
- **Imports / external triggers** (jobs, hooks, seed, import endpoints)
- **Web UI surfaces** (Admin vs Me, key screens/actions)

Each `###` section should be 2–4 sentences. Mention the *most relevant* services/APIs/policies by name only when it clarifies "where it lives".

### 4) Edit the README safely

Rules:

- Keep existing non-Flow sections unless asked to change them.
- If `## Flow` exists: replace only the content under `## Flow` up to the next `## ` heading.
- If `## Flow` is missing: insert it near the top (right after the title line), before `## Documents`/`## Release`/etc.
- Do not add redundant narration or low-value lists of files.
- Keep formatting consistent: `## Flow` then `### ...` subsections, blank lines between sections.
- For AI Assistants without direct file edit capabilities, output the formatted markdown block for the user to copy-paste. For autonomous agents, apply the edits directly.

### 5) Quick verification

- Re-read the edited README and confirm:
  - It covers the real business rules (constraints/transitions).
  - It doesn't contradict code.
  - There is no accidental deletion of other README sections.

## Output template (Flow)

Use this structure:

```markdown
## Flow

### <Flow name>
<2–4 sentences describing behavior + where implemented>

### <Flow name>
...
```

## Notes

- Prefer correctness over completeness; surface only the "spine" of the module.
- If the module already has domain docs (examples/scripts), keep them and make Flow complementary.
