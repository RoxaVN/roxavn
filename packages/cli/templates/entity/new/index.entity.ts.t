---
sh: "cat >> src/server/entities/index.ts"
---
export * from './<%= h.changeCase.dot(entity_name) %>';
