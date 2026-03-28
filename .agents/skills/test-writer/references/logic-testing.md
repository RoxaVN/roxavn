# Logic and Service Testing

## Pattern

Import logic utilities and rely on global `describe`, `expect`, `it`, and `vi`.

```typescript
import { myUtility } from './utils.js';

describe('myUtility', () => {
  it('handles transformations and async calls', async () => {
    const callback = vi.fn();
    const result = await myUtility('input', callback);
    
    expect(result).toBe('output');
    expect(callback).toHaveBeenCalledWith('processed');
  });
});
```

## Module Mocking

Use `vi.mock` to mock internal dependencies.

```typescript
vi.mock('./db.js', () => ({
  query: vi.fn().mockResolvedValue([]),
}));
```
