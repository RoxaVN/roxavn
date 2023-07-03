---
inject: true
to: src/server/index.ts
append: true
skip_if: migrations
---
export * from './migrations/index.js';