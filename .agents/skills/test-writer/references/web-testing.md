# Web Component and Page Testing

## Page Testing (Standard CRUD)

For standard admin pages, use `PageTester` from `@roxavn/core/web/testing`. It provides automated tests for standard flows.

```typescript
import { PageTester } from '@roxavn/core/web/testing';
import { myPage } from './myPage.js';

describe('myPage', () => {
  it('should support standard flows', async () => {
    const pageTester = new PageTester(myPage);
    await pageTester.testFilter();
    await pageTester.testAdd();
    await pageTester.testItemActions([0, 1]); // test actions for first two items
  });
});
```

## Component Testing (Custom UI)

Use `render` from `@roxavn/core/web/testing`. It wraps components with Mantine and API providers.

```typescript
import { render } from '@roxavn/core/web/testing';
import { MyComponent } from './MyComponent.js';

describe('MyComponent', () => {
  it('handles interaction', async () => {
    const screen = await render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await button.click();
    
    expect(button).toBeDisabled();
  });
});
```

## Service/API Mocking

Use `ApiMocker` for fine-grained control or `vi.mock` for global service mocks.

```typescript
import { ApiMocker } from '@roxavn/core/web/testing';

const apiMocker = new ApiMocker();
apiMocker.mock(api, ({ response }) => ({
  ...response,
  items: [{ id: '1', name: 'Test' }],
}));
```
