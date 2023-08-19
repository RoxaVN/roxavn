---
to: src/server/services/<%= h.changeCase.dot(api_source_name) %>.ts
inject: true
append: true
skip_if: '\.getMany\)'
---
<%= '' %>
@serverModule.useApi(<%= h.changeCase.camel(api_source_name) %>Api.getMany)
export class Get<%= h.changeCase.pascal(api_source_name) %>sApiService extends InjectDatabaseService {
  async handle(request: InferApiRequest<typeof <%= h.changeCase.camel(api_source_name) %>Api.getMany>) {
    const page = request.page || 1;
    const pageSize = request.pageSize || 10;

    const [items, totalItems] = await this.entityManager
      .getRepository(<%= h.changeCase.pascal(api_source_name) %>)
      .findAndCount({
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: items,
      pagination: { page, pageSize, totalItems },
    };
  }
}