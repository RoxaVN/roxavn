import { Empty } from './api';
import { urlUtils } from './url';

export class WebRoute<
  Params extends Record<string, any> = Empty,
  Query extends Record<string, any> = Empty
> {
  constructor(readonly path: string) {}

  generate(params: Params, query?: Query) {
    const url = urlUtils.generatePath(this.path, params).path;
    return query ? `${url}?${new URLSearchParams(query)}` : url;
  }
}
