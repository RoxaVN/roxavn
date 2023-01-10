---
inject: true
to: src/server/index.ts
append: true
skip_if: entities
---
export * from './entities';
