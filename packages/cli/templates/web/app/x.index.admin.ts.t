---
sh: "cat >> src/web/app/index.ts"
---
export * from './<%= h.changeCase.dot(path_name) %>';
