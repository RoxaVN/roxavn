---
to: src/base/access.ts
inject: true
after: 'export const permissions'
skip_if: 'Create<%= h.changeCase.pascal(api_source_name) %>:'
---
  Create<%= h.changeCase.pascal(api_source_name) %>: {},
