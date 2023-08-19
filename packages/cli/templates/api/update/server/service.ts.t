---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
append: true
skip_if: '\.update\)'
---
<%= '' %>
@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.update)
export class Update<%= h.changeCase.pascal(api_source_name) %>ApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.update>) {
    await this.entityManager
      .getRepository(<%= h.changeCase.pascal(api_source_name) %>)
      .update(
        { id: request.<%= h.changeCase.camel(api_source_name) %>Id },
        { }
      );
    return {}
  }
}
