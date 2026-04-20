# Pure Logic and Utility Testing

## Pattern

For shared code, base logic, and pure utilities, rely on standard Vitest features. These tests usually don't require database setup or DOM rendering.

```typescript
import { myUtility } from './utils.js';

describe('myUtility', () => {
  it('handles transformations correctly', () => {
    const result = myUtility('input');
    expect(result).toBe('output');
  });

  it('handles async logic', async () => {
    const result = await myUtility('async-input');
    expect(result).toBe('async-output');
  });
});
```

## Mocking

Use `vi.mock` for external dependencies and `vi.fn()` for callbacks.

```typescript
vi.mock('node:fs', () => ({
  readFileSync: vi.fn().mockReturnValue('content'),
}));
```
