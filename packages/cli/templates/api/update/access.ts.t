---
to: src/base/access.ts
inject: true
after: 'export const permissions'
skip_if: 'Update<%= h.changeCase.pascal(api_source_name) %>:'
---
  Update<%= h.changeCase.pascal(api_source_name) %>: {},