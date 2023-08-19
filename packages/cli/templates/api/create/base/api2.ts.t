---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
after: export const
skip_if: '\.create\('
---
  create: <%= api_source_name %>Source.create({
    validator: Create<%= h.changeCase.pascal(api_source_name) %>Request,
    permission: permissions.Create<%= h.changeCase.pascal(api_source_name) %>,
  }),
