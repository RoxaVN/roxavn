---
name: test-writer
description: Write unit and integration tests for React components and logic in the roxavn project. Use when the user asks to add tests, fix failing tests, or improve test coverage.
---

# Test Writer Skill

This skill provides guidance for writing tests in `roxavn`. The project uses Vitest-based testing via `@roxavn/testing`.

## Core Principles

- **Framework**: Use `@roxavn/testing`. It re-exports Vitest utilities: `describe`, `expect`, `it`, `test`, `beforeEach`, `afterEach`, `beforeAll`, `afterAll`, and `vi` (aliased as `sandbox`).
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
Use `sandbox` (Vitest's `vi`) for all mocking needs:
```typescript
import { sandbox } from '@roxavn/testing';

sandbox.mock('../module.js', () => ({
  fn: sandbox.fn().mockResolvedValue('value'),
}));

// Use sandbox.waitFor for async UI changes
await sandbox.waitFor(() => expect(el).toBeVisible());
```
