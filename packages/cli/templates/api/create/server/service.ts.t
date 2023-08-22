---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
append: true
skip_if: '\.create\)'
---
<%= '' %>
@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.create)
export class Create<%= h.changeCase.pascal(api_source_name) %>ApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.create>) {
    const item = new <%= h.changeCase.pascal(api_source_name) %>();
    Object.assign(item, request);

    await this.entityManager.getRepository(<%= h.changeCase.pascal(api_source_name) %>).insert(item);
    return { id: item.id };
  }
}