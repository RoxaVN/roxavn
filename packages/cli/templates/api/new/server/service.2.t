---
sh: "cat >> src/server/services/index.ts"
---
export * from './<%= h.changeCase.dot(api_source_name) %>.js';
