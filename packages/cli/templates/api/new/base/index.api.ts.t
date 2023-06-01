---
sh: "cat >> src/base/apis/index.ts"
---
export * from './<%= h.changeCase.dot(api_source_name) %>.js';
