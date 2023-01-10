---
sh: "cat >> src/share/apis/index.ts"
---
export * from './<%= h.changeCase.dot(api_name) %>';
