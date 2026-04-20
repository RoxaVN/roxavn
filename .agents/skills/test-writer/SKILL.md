---
name: test-writer
description: Write unit and integration tests for React components and logic in the roxavn project. Use when the user asks to add tests, fix failing tests, or improve test coverage.
---

# Test Writer Skill

This skill provides guidance for writing tests in `roxavn`. The project uses Vitest-based testing via `@roxavn/testing`.

## Core Principles

- **Framework**: Use `vitest`.
- **Globals**: `describe`, `expect`, `it`, `test`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll` are available as globals. Do NOT import them.
- **Mocking**: Use `vi` (Vitest's built-in utility) for all mocking and spying needs.
- **File Naming**: Use `*.test.ts` or `*.test.tsx` next to the source file.
- **ESM**: Use `.js` extension in local file imports.

## Workflow Selection

- **Server Services**: See [references/server-testing.md](references/server-testing.md) for testing server-side services with database setup.
- **Web Pages**: See [references/web-testing.md](references/web-testing.md) for UI/React testing using `PageTester`.
- **Pure Logic**: See [references/logic-testing.md](references/logic-testing.md) for shared/base logic and utility testing.

## Common Patterns

### Server Testing (Services)
Use `setUpDatabase` from `@roxavn/core/server/testing` to initialize a temporary database for the test suite.

### Web Testing (Pages)
Use `PageTester` from `@roxavn/core/web/testing` to test standard page flows like filtering and adding items.

### Running Tests
```bash
npm test -- path/to/file.test.ts
```

### Mocking & Spies
Use `vi` for all mocking needs:
```typescript
vi.mock('../module.js', () => ({
  fn: vi.fn().mockResolvedValue('value'),
}));

// Use vi.waitFor for async UI changes
await vi.waitFor(() => expect(el).toBeVisible());
```
