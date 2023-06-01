---
sh: "cat >> src/web/admin/index.ts"
---
export * from './<%= h.changeCase.dot(path_name) %>.js';
