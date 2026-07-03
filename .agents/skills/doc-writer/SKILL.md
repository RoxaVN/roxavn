---
name: doc-writer
description: Write JSDoc documentation for Roxavn module services, utilities, React components, and hooks. Use when user asks to document, add JSDoc, or write docs for a module's exports. These JSDocs power the Story Documentation System with interactive playgrounds.
---

# Doc Writer Skill

Writes JSDoc documentation for Roxavn modules. JSDocs power the **Story Documentation System** by providing descriptions and `@example` tags that Story uses to generate interactive playgrounds.

## Core Concepts

- **JSDoc + Story**: Source file JSDocs are extracted by Story files to display documentation
- **`@example` tag**: Framework extracts code from `@example` for interactive playgrounds
- **4 Export Types**: Each type has specific JSDoc + `@example` patterns

## Export Type → JSDoc Pattern

| Export Type | Location | `@example` Format |
|-------------|----------|-------------------|
| Utils/Functions/Constants | `src/base/*.ts` | `return expression;` |
| Services | `src/server/services/*.ts` | `return service.handle({...});` |
| React Components | `src/web/export/components/*.tsx` | JSX (no `return`) |
| React Hooks | `src/web/export/hooks/*.ts` | `() => { ... return <div/>; }` |

## JSDoc Templates

### 1. Utils — Functions/Constants (`src/base/`)

```typescript
/**
 * Short description of what this does.
 *
 * @example
 * return myFunction(arg1, arg2);
 */
export const myFunction = (...) => { ... };
```

**Key rules:**
- `@example` MUST have `return <expression>;`
- Playground executes and displays result
- For constants: `return CONSTANT_NAME;`
- For functions: `return functionName(args);`

### 2. Services (`src/server/services/`)

```typescript
/**
 * Short description of what the service method does.
 *
 * @param request - Description of request params
 * @example
 * return service.handle({ param: 'value' });
 */
async handle(request) {
  // ...
}
```

**Key rules:**
- `@example` uses `return service.handle({...});`
- Playground executes on server (can test real DB operations)
- Include `@param` descriptions for request fields

### 3. React Components (`src/web/export/components/`)

```typescript
/**
 * Short description of what this component does.
 *
 * @example
 * <MyComponent
 *   propA="value"
 *   onEvent={(result) => console.log(result)}
 * />
 */
export const MyComponent = (props) => { ... };
```

**Key rules:**
- `@example` is JSX with props
- No `return` keyword needed
- Include common prop examples
- For complex interactions, use `noInline: true` pattern (handled in Story file)

### 4. React Hooks (`src/web/export/hooks/`)

```typescript
/**
 * Short description of what this hook does.
 *
 * @example
 * () => {
 *   const { data, loading } = useMyHook();
 *   return <div>{loading ? 'Loading...' : data.name}</div>;
 * }
 */
export function useMyHook() { ... }
```

**Key rules:**
- `@example` is an arrow function that returns JSX
- Destructure hook return values for display
- Include conditional rendering for optional states

## Workflow

### Step 1: Scan Module Structure

Identify all export files that need documentation:

```
module/
├── src/
│   ├── base/                       → Utils/Functions/Constants
│   │   ├── errors.ts              ✓ check JSDoc
│   │   ├── constants.ts           ✓ check JSDoc
│   │   ├── utils.ts                ✓ check JSDoc
│   │   └── module.ts               ✗ skip (module config)
│   │
│   ├── server/services/           → Services
│   │   ├── user.ts                ✓ check JSDoc
│   │   └── identity.ts            ✓ check JSDoc
│   │
│   └── web/export/components/     → React Components
│       ├── UserInput.tsx          ✓ check JSDoc
│       ├── PasswordLoginForm.tsx  ✓ check JSDoc
│       └── index.ts               ✗ skip (barrel export)
│
└── src/web/export/hooks/          → React Hooks
    ├── useUser.ts                 ✓ check JSDoc
    └── useAuth.ts                 ✓ check JSDoc
```

### Step 2: Check Existing JSDoc

For each source file, check:
- Is there a JSDoc comment?
- Does it have an `@example` tag?
- Is the description complete?

### Step 3: Categorize by Export Type

**Utils (ModuleStory pattern):**
- Functions with `return expression;`
- Constants/error factories
- Classes that are exported directly

**Services (ServerStory pattern):**
- Classes with `handle()` method decorated with `@useApi()`
- Include `@example return service.handle({...});`

**Components (ComponentStory pattern):**
- React components (capitalized names)
- Include `@example` with JSX prop examples

**Hooks (HookStory pattern):**
- Functions starting with `use`
- Include `@example` as arrow function returning JSX

### Step 4: Write/Update JSDoc

Add or update JSDoc following the templates above:

```typescript
// BEFORE (missing JSDoc)
export const wrongRetypePasswordError = validationErrorFactory.make(...);

// AFTER (with JSDoc)
export const wrongRetypePasswordError = validationErrorFactory.make(...);
```

becomes:

```typescript
/**
 * Error thrown when retyped password does not match.
 *
 * @example
 * return wrongRetypePasswordError;
 */
export const wrongRetypePasswordError = validationErrorFactory.make(...);
```

### Step 5: Verify JSDoc Completeness

After adding JSDoc, verify:

| Export | Description | @example | Format Correct |
|--------|-------------|----------|----------------|
| `myFunction` | ✓ | ✓ | ✓ |
| `UserInput` | ✓ | ✓ | ✗ needs JSX |

## Quick Reference

### Error Factory JSDoc
```typescript
/**
 * Error thrown when storage limit is exceeded.
 *
 * @example
 * return exceedStorageLimitErrorFactory;
 */
export const exceedStorageLimitErrorFactory = new BaseErrorFactory({...});
```

### Service Method JSDoc
```typescript
/**
 * Get a user by ID.
 *
 * @param request.id - The user ID
 * @example
 * return service.handle({ id: 'user-123' });
 */
async handle(request) { ... }
```

### Component JSDoc
```typescript
/**
 * A select input for choosing users.
 *
 * @example
 * <UserInput
 *   onChange={(value) => console.log(value)}
 * />
 */
export const UserInput = (props) => ...;
```

### Hook JSDoc
```typescript
/**
 * Returns the current authenticated user.
 *
 * @example
 * () => {
 *   const user = useAuthUser();
 *   return <div>{user?.name ?? 'Guest'}</div>;
 * }
 */
export function useAuthUser() { ... }
```

## Common Issues

1. **Missing `return` in utils**: Playground shows empty result
2. **Missing `return` in services**: Playground shows undefined
3. **Missing arrow function in hooks**: Story won't render correctly
4. **No JSX in component examples**: Playground won't show component
5. **Vague descriptions**: Be specific about what the export does and when to use it