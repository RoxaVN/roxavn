---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
append: true
skip_if: '\.getOne\)'
---
<%= '' %>
@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.getOne)
export class Get<%= h.changeCase.pascal(api_source_name) %>ApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.getOne>) {
    const item = await this.entityManager.getRepository(<%= h.changeCase.pascal(api_source_name) %>).findOne({
      cache: true,
      where: { id: request.<%= h.changeCase.camel(api_source_name) %>Id },
    });

    if (item) {
      return item;
    }
    throw new NotFoundException();
  }
}
