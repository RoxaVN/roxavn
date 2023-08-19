---
to: src/base/access.ts
inject: true
after: 'export const permissions'
skip_if: 'Read<%= h.changeCase.pascal(api_source_name) %>s:'
---
  Read<%= h.changeCase.pascal(api_source_name) %>s: {},