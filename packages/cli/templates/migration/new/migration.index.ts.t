---
sh: "cat >> src/server/migrations/index.ts"
---
export * from './<%= ts %>.<%= h.changeCase.dot(name) %>.js';
