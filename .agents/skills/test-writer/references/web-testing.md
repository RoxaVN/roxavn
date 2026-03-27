# Web Component Testing

## Pattern

Always import `describe`, `expect`, `it`, `sandbox` from `@roxavn/testing`. Use local `render` from `../../testing/index.js`.

```typescript
import { describe, expect, it, sandbox } from '@roxavn/testing';
import { render } from '../../testing/index.js';
import { MyComponent } from './MyComponent.js';

describe('MyComponent', () => {
  it('handles interaction and async state', async () => {
    const onClick = sandbox.fn().mockResolvedValue('ok');
    const screen = await render(<MyComponent onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await button.click();
    
    // Check loading state (data-loading attribute)
    expect(button).toHaveAttribute('data-loading', 'true');
    
    await sandbox.waitFor(() => {
      expect(button).not.toHaveAttribute('data-loading');
    });
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Service Mocking

```typescript
sandbox.mock('../../services/modal.js', () => ({
  openModal: sandbox.fn(),
}));
```
