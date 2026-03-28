# Web Component Testing

## Pattern

Rely on global `describe`, `expect`, `it`, and `vi`. Use local `render` from `../../testing/index.js`.

```typescript
import { render } from '../../testing/index.js';
import { MyComponent } from './MyComponent.js';

describe('MyComponent', () => {
  it('handles interaction and async state', async () => {
    const onClick = vi.fn().mockResolvedValue('ok');
    const screen = await render(<MyComponent onClick={onClick} />);
    
    const button = screen.getByRole('button');
    await button.click();
    
    // Check loading state (data-loading attribute)
    expect(button).toHaveAttribute('data-loading', 'true');
    
    await vi.waitFor(() => {
      expect(button).not.toHaveAttribute('data-loading');
    });
    expect(onClick).toHaveBeenCalled();
  });
});
```

## Service Mocking

```typescript
vi.mock('../../services/modal.js', () => ({
  openModal: vi.fn(),
}));
```
