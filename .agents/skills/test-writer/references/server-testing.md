# Server Service Testing

## Pattern

Use `setUpDatabase` from `@roxavn/core/server/testing` to initialize a temporary database for the test suite. All services are accessed via `.getInstance()`.

```typescript
import { setUpDatabase } from '@roxavn/core/server/testing';
import { MyService } from './my.service.js';

describe('MyService', async () => {
  await setUpDatabase();

  it('should handle logic correctly', async () => {
    const service = await MyService.getInstance();
    const result = await service.handle({
      param1: 'value',
    });
    
    expect(result).toEqual({ success: true });
  });

  it('should throw error for invalid input', async () => {
    const service = await MyService.getInstance();
    await expect(service.handle({
      param1: 'invalid',
    })).rejects.toThrow();
  });
});
```

## Database State

`setUpDatabase` starts a fresh PostgreSQL container and runs all migrations. Use `afterAll` (automatically handled by `setUpDatabase`) to clean up.
