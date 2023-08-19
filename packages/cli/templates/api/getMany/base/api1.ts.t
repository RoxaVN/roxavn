---
to: src/base/apis/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
before: export const
skip_if: '\.getMany\('
---
class Get<%= h.changeCase.pascal(api_source_name) %>sRequest extends ExactProps<Get<%= h.changeCase.pascal(api_source_name) %>sRequest> {
  @Min(1)
  @TransformNumber()
  @IsOptional()
  public readonly page?: number;

  @Min(1)
  @Max(100)
  @TransformNumber()
  @IsOptional()
  public readonly pageSize?: number;
}
