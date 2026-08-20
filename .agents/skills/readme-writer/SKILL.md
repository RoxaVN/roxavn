---
name: readme-writer
description: Writes or rewrites a Roxavn module README.md in a consistent, table-and-flow-oriented style. Use when the user asks to write, rewrite, or restructure a module README, document tables/services/web UI, or summarize the module for new contributors.
---

# README Writer (Roxavn Module)

## Goal

Produce a high-signal, technically correct `README.md` for a Roxavn module by inspecting the codebase and editing the file directly. The README is structured into **four sections** that describe the module as a product surface: introduction, database tables with their services, web UI surfaces, and exported web components.

**Skip empty sections:** if a module has no tables to describe, no web pages, or no web components, omit the corresponding section entirely instead of writing a placeholder. The introduction is always required; Sections 2–4 are each optional based on what the module actually ships.

## When to use

- The user asks to "write the README", "rewrite the README", "document tables", "list services", or "describe the module".
- A module has an outdated, missing, or Vietnamese-only README and needs a consistent English rewrite.
- A new module is created and needs its initial README.

## Output language

- Write the README in **English** by default. (Earlier ROXAVN READMEs were Vietnamese; the new convention is English unless the user explicitly asks for Vietnamese.)

## AI Assistant Instructions (Workflow)

Follow these steps in order.

### 1) Confirm style with the user (only if ambiguous)

The default style is the 4-section layout below. If the user asks for a different structure (e.g. "Flow sections", "API tables", "include env vars"), ask which style they want before writing. If they say "use the standard format" or no format is specified, use the 4-section layout.

### 2) Inspect the module like a product surface

Read only what you need, but cover:

- **Entrypoints**
  - `README.md` (current state)
  - `src/base/index.ts`
  - `src/server/index.ts` (if present)
  - `package.json` (name, exports)
- **Access / auth**
  - `src/base/access.ts` (scopes, permissions, roles, policies)
- **APIs**
  - `src/base/apis/*.ts` (endpoints and the policies they enforce)
- **Server behavior**
  - `src/server/services/*.ts` (real business rules, validations, derived fields)
  - `src/server/hooks/*.ts` (seed, jobs, integration points)
  - `src/server/schemas/public/*.d.ts` — **authoritative source for table columns**
- **Web UX**
  - `src/web/admin/*`, `src/web/me/*`, `src/web/pages/*`, `src/web/init/*`
  - `src/web/export/components/*` for the components table

Output should reflect *behavior and structure*, not file inventories.

### 3) Author the README — 4-section structure

#### Section 1 — Introduction (3–4 lines)

- One short paragraph. Cover: what the module does, who uses it, and the kind of UX it ships with.
- Do not list features here; save them for later sections.
- Do not include code blocks.

#### Section 2 — Tables

For each table owned by the module (one `### Table` subsection per table):

- Header: `### \`<table_name>\``
- Column list as bullet points, one per line, in the format:
  - `\`columnName\`` — short description; mention enum values, regex, length, or FK when relevant
- Then a `**Services:**` line followed by a bullet list of services that read or write that table. For each service, give a one-line description of what it does.
- **Omit** `createdDate`, `updatedDate`, and `metadata` columns. They are noise for a contributor-facing README.
- **Keep** functional auxiliary columns like FTS columns, `token`, `identityId`, `avatar`, `settings` — anything that has a dedicated service or business meaning.
- If a service touches multiple tables, mention it under the primary table only, with a short cross-reference if needed.
- Skip tables that the module doesn't own but only references (e.g. cross-module join tables the core provides).

#### Section 3 — Web UI

Three subsections:

- **Admin pages** — list page files in `src/web/admin/` with one-line descriptions each.
- **Me pages** — list page files in `src/web/me/` with one-line descriptions.
- **Standalone pages** — list any pages in `src/web/pages/` (login, reset-password, etc.) with their route.

**Skip empty subsections:** if a module has no files in a given subdirectory, omit that subsection entirely — do NOT write a placeholder like "No admin pages" or "No self-service pages". An empty Web UI section (all three subsections absent) should be omitted too; if the module ships no pages at all, drop the whole `## Web UI` section.

#### Section 4 — Web components

A markdown table with columns `Component` and `Purpose`. Cover every component exported from `src/web/export/components/` (excluding `.test.tsx` and `.story.tsx` files).

- For each component, mention what template or namespace it binds to (e.g. `userInputTemplate`, `roleUsersTemplate`) **inline in the Purpose cell**. This helps readers know where the component will appear without reading the source.
- **Skip empty section:** if `src/web/export/components/` has no exports (or only test/story files), omit the whole `## Web components` section.

### 4) Things to exclude from the README

The README describes the module's product surface. Do **not** include:

- API endpoint tables (HTTP method/path/permission) — out of scope for this style.
- Full permission/role enumerations.
- Environment variables.
- Peer dependencies.
- Scripts (build/dev/test).
- Package `exports` map.
- Authorization rule examples (scope + scopeId semantics).
- Database migration history.
- i18n key lists.

If the user explicitly asks for any of these, add them in a separate appendix section after Section 4.

### 5) Edit the README safely

Rules:

- Replace the entire `README.md` content with the new 4-section structure, unless the user asks to preserve specific existing sections.
- Keep the file's first line as `# <package-name>` (use the `name` field from `package.json`, e.g. `# @roxavn/module-user`).
- Use `## Tables`, `## Web UI`, and `## Web components` as the H2 headers for Sections 2/3/4.
- Blank lines between sections and between subsections.
- Use fenced code only for column names in the tables section; never embed code blocks in the introduction or web-UI sections.
- If the package has `.web/components` files but no `src/web/export/components/` directory, fall back to scanning `src/web/components/` or wherever components are colocated.

### 6) Quick verification

Re-read the edited README and confirm:

- Every table listed in Section 2 has a matching schema in `src/server/schemas/public/`.
- Every service listed under a table actually exists in `src/server/services/`.
- Every component in Section 4 is exported from `src/web/export/components/index.ts`.
- Every admin/me/page file mentioned in Section 3 actually exists on disk.
- The introduction does not contradict the code (e.g. claiming the module manages permissions if `permission` is not a table it owns).
- The README is in English (unless the user asked otherwise).

## Output template

```markdown
# @roxavn/<module-name>

<3–4 lines: what the module is, who uses it, what UI it ships.>

## Tables

### \`user\`

- \`id\` — primary key
- \`username\` — unique, regex `^[a-z...]$`, 4-32 chars
- ...

**Services:**

- `GetUserService` — fetch one user by id
- `GetUsersService` — paginated list
- ...

### \`<other_table>\`
...

## Web UI

### Admin pages

- **Users** (`users.tsx`) — list, search, create, edit, delete users
- ...

### Me pages

- **Settings** (`settings.tsx`) — update display name and language
- ...

### Standalone pages

- **Login** (`login.tsx`) — username + password sign-in
- ...

## Web components

All exported from `@roxavn/<module-name>/web`:

| Component | Purpose |
| --- | --- |
| `PasswordLoginForm` | Username + password sign-in form |
| `UserInput` | User picker (wired to `userInputTemplate`) |
| ... | ... |
```

## Notes

- Prefer correctness over completeness. If a service does something subtle (e.g. validates scope compatibility, strips `sensitiveData` from responses, or rebinds a core service), mention it in the one-line description.
- Keep service descriptions **action-oriented**: "create a session", "validate X against Y", "strip Z from response" — not "handles identities".
- The 4-section style is for contributor orientation. End-user docs (how to call APIs, how to configure) live elsewhere.
