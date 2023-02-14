import { Empty } from './api';
import { urlUtils } from './url';

export class WebRoute<
  Params extends Record<string, any> = Empty,
  Query extends Record<string, any> = Empty
> {
  constructor(readonly path: string) {}

  generate(data: Params & Query) {
    const { path, params } = urlUtils.generatePath(this.path, data);
    return `${path}?${new URLSearchParams(params)}`;
  }
}
