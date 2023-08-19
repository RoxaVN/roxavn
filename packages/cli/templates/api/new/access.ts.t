---
to: src/base/access.ts
inject: true
after: 'export const scopes'
skip_if: '<%= h.changeCase.pascal(api_source_name) %>:'
---
  <%= h.changeCase.pascal(api_source_name) %>: { name: '<%= h.changeCase.camel(api_source_name) %>' },