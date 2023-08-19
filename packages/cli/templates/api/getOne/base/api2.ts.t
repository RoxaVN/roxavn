---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
after: export const
skip_if: '\.getOne\('
---
  getOne: <%= api_source_name %>Source.getOne({
    validator: Get<%= h.changeCase.pascal(api_source_name) %>Request,
    permission: permissions.Read<%= h.changeCase.pascal(api_source_name) %>,
  }),