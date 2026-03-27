# Logic and Service Testing

## Pattern

Import logic utilities and `@roxavn/testing` for standard assertions and mocking.

```typescript
import { describe, expect, it, sandbox } from '@roxavn/testing';
import { myUtility } from './utils.js';

describe('myUtility', () => {
  it('handles transformations and async calls', async () => {
    const callback = sandbox.fn();
    const result = await myUtility('input', callback);
    
    expect(result).toBe('output');
    expect(callback).toHaveBeenCalledWith('processed');
  });
});
```

## Module Mocking

Use `sandbox.mock` to mock internal dependencies.

```typescript
sandbox.mock('./db.js', () => ({
  query: sandbox.fn().mockResolvedValue([]),
}));
```
