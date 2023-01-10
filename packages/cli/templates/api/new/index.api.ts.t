---
sh: "cat >> src/server/apis/index.ts"
---
export * from './<%= h.changeCase.dot(api_name) %>';
