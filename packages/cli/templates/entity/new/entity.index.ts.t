---
inject: true
to: src/server/entities/index.ts
append: true
---
export * from './<%= h.inflection.underscore(entity_name).replaceAll('_', '.') %>.entity';
