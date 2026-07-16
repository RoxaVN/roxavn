---
name: story-writer
description: Write Story files for Roxavn modules to auto-generate documentation with interactive playgrounds. Use when the user asks to add stories, document a module, or generate documentation for components/utilities/services.
---

# Story Writer Skill

Generates Story files for Roxavn modules following the **Story Documentation System**. Stories automatically extract API docs, JSDoc, and generate interactive playgrounds from `@example` tags.

## Core Concepts

- **Story Files**: Sidecar files (`.story.tsx`) placed next to source files
- **Naming Convention**: `<SourceName>.story.tsx` matches `<SourceName>.ts/tsx`
- **JSDoc `@example`**: Framework extracts code from `@example` tags to create playgrounds
- **Interactive Playgrounds**: Allow users to edit and run code directly in docs

## Story Types

### 1. ModuleStory — Utilities/Functions/Constants (`src/base/`)

**Pattern:**
```typescript
import { ModuleStory } from '@roxavn/stories/web';
import { export1, export2, ClassName } from './source.js';

export default ModuleStory({
  exports: { export1, export2, ClassName },
});
```

**Source JSDoc requirements:**
- Must have `@example` tag with `return <expression>;` statement
- The `return` is required — playground executes the example and displays result

**Example source:**
```typescript
/**
 * Validates that two passwords match.
 *
 * @example
 * return wrongRetypePasswordError;
 */
export const wrongRetypePasswordError = validationErrorFactory.make(...);
```

### 2. ComponentStory — React Components (`src/web/export/components/`)

**Pattern:**
```typescript
import { ComponentStory } from '@roxavn/stories/web';
import { ComponentName } from '../index.js';

export default ComponentStory({
  component: ComponentName,
});
```

**Source JSDoc requirements:**
- Must have `@example` tag with JSX (no `return` needed)
- For complex examples, use `noInline: true` with `render()` call

**Example source:**
```typescript
/**
 * A select input for choosing users from the API.
 *
 * @example
 * <UserInput
 *   onChange={(value) => console.log(value)}
 * />
 */
export const UserInput = (props) => (...);
```

### 3. ServerStory — Server Services (`src/server/services/`)

**Pattern:**
```typescript
import { ServerStory } from '@roxavn/stories/web';
import { ServiceA, ServiceB } from './service.js';
import { serverModule } from '../module.js';

export default ServerStory({});

export const loader = serverModule.storyLoader({ServiceA, ServiceB});
```

**Source JSDoc requirements:**
- Methods should have `@example` with `return service.handle({...});`
- Playground executes on server — can test real DB operations

**Example source:**
```typescript
/**
 * Get a user by ID.
 *
 * @example
 * return service.handle({ id: 'user-123' });
 */
async handle(request) {
  return super.getOne('user', request);
}
```

### 4. HookStory — React Hooks (`src/web/export/hooks/`)

**Pattern:**
```typescript
import { HookStory } from '@roxavn/stories/web';
import { useHookName } from './useHookName.js';

export default HookStory({
  hook: useHookName,
});
```

**Source JSDoc requirements:**
- Must have `@example` tag with JSX that calls the hook
- Must use arrow function returning JSX: `() => { ... return <div/>; }`

**Example source:**
```typescript
/**
 * Returns the current authenticated user.
 *
 * @example
 * () => {
 *   const user = useAuthUser();
 *   return <div>{user ? user.username : 'Not logged in'}</div>;
 * }
 */
export function useAuthUser() { ... }
```

## File Location Mapping

| Source Location | Story Type | Story Location |
|----------------|------------|----------------|
| `src/base/*.ts` | ModuleStory | Same as source |
| `src/web/export/components/*.tsx` | ComponentStory | Same as source |
| `src/web/export/hooks/*.ts` | HookStory | Same as source |
| `src/server/services/*.ts` | ServerStory | Same as source |

## Workflow

### Step 1: Scan Module Structure

Identify all source files that need stories:

```
module/
├── src/
│   ├── base/                    → ModuleStory candidates
│   │   ├── errors.ts           ✓ needs story
│   │   ├── constants.ts        ✓ needs story
│   │   ├── utils.ts            ✓ needs story
│   │   └── module.ts           ✗ skip (module config)
│   │
│   ├── server/services/        → ServerStory candidates
│   │   ├── user.ts             ✓ needs story
│   │   └── identity.ts         ✓ needs story
│   │
│   └── web/export/components/  → ComponentStory candidates
│       ├── UserInput.tsx        ✓ needs story
│       ├── PasswordLoginForm.tsx ✓ needs story
│       └── index.ts            ✗ skip (barrel export)
│
└── (check for hooks/ folder)
    └── src/web/export/hooks/          → HookStory candidates
```

### Step 2: Categorize by Story Type

- **ModuleStory**: `src/base/` files that export functions/classes/constants
- **ComponentStory**: `src/web/export/components/*.tsx` files
- **ServerStory**: `src/server/services/*.ts` files
- **HookStory**: `src/web/export/hooks/*.ts` files

### Step 3: Check Existing Stories

Look for existing `.story.tsx` files to avoid duplicates:
- Skip files that already have stories
- Focus on source files without corresponding story files

### Step 4: Generate Story Files

For each source file, generate the appropriate story type following the patterns above.

**Key rules:**
- Export default the Story object
- For ServerStory, also export `loader = serverModule.storyLoader(services)`
- Use relative imports with `.js` extension (ESM)
- Import from `../index.js` for components (follows module-user pattern)

### Step 5: Verify JSDoc Examples

If source files lack proper `@example` tags, the stories will still work but won't have playground content. For complete documentation, ensure source files have:

- **ModuleStory**: `@example` with `return expression;`
- **ComponentStory**: `@example` with JSX
- **ServerStory**: `@example` with `return service.method(...);`
- **HookStory**: `@example` with arrow function returning JSX

## Quick Reference

```typescript
// ModuleStory
import { ModuleStory } from '@roxavn/stories/web';
import { myExport } from './source.js';
export default ModuleStory({ exports: { myExport } });

// ComponentStory
import { ComponentStory } from '@roxavn/stories/web';
import { MyComponent } from '../index.js';
export default ComponentStory({ component: MyComponent });

// HookStory
import { HookStory } from '@roxavn/stories/web';
import { useMyHook } from './useMyHook.js';
export default HookStory({ hook: useMyHook });

// ServerStory
import { ServerStory } from '@roxavn/stories/web';
import { ServiceA, ServiceB } from './service.js';
import { serverModule } from '../module.js';

export default ServerStory({});

export const loader = serverModule.storyLoader({ServiceA, ServiceB});
```

## Common Pitfalls

1. **Missing `return` in ModuleStory examples**: Playground won't display anything
2. **Wrong import path**: Use `../index.js` for components, `./source.js` for base/services
3. **Missing `.js` extension**: ESM requires `.js` extension in imports
4. **ServerStory without `serverModule.storyLoader()`**: Won't have interactive playground
5. **Skipping barrel files**: Don't create stories for `index.ts` files