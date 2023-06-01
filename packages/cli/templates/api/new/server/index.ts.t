---
inject: true
to: src/server/index.ts
append: true
skip_if: services
---
export * from './services/index.js';