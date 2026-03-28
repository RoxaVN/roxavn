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

- **Web Components**: See [references/web-testing.md](references/web-testing.md) for UI/React testing patterns.
- **Logic & Services**: See [references/logic-testing.md](references/logic-testing.md) for pure logic and mocking.

## Common Patterns

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
