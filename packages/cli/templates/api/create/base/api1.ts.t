---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
before: export const
skip_if: '\.create\('
---
class Create<%= h.changeCase.pascal(api_source_name) %>Request extends ExactProps<Create<%= h.changeCase.pascal(api_source_name) %>Request> {
  @MinLength(1)
  public readonly name: string;
}
