---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
after: export const
skip_if: '\.getMany\('
---
  getMany: <%= api_source_name %>Source.getMany({
    validator: Get<%= h.changeCase.pascal(api_source_name) %>sRequest,
    permission: permissions.Read<%= h.changeCase.pascal(api_source_name) %>s,
  }),