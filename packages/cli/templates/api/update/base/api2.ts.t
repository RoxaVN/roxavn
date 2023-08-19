---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
after: export const
skip_if: '\.update\('
---
  update: <%= api_source_name %>Source.update({
    validator: Update<%= h.changeCase.pascal(api_source_name) %>Request,
    permission: permissions.Update<%= h.changeCase.pascal(api_source_name) %>,
  }),