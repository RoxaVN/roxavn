---
sh: "cat >> src/web/me/index.ts"
---
export * from './<%= h.changeCase.dot(path_name) %>.js';
