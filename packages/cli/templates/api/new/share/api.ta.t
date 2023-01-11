---
to: src/share/apis/<%= h.changeCase.dot(api_name) %>.ts
---
import {
  Api,
  ExactProps,
  ForbiddenException,
  IsOptional,
  Min,
  PaginatedCollection,
  UnauthorizedException,
} from '@roxavn/core/share';
import { Type } from 'class-transformer';

import { baseModule } from '../module';

class <%= api_name %>Request extends ExactProps<<%= api_name %>Request> {
  @IsOptional()
  public readonly username?: string;

  @Min(1)
  @Type(() => Number)
  @IsOptional()
  public readonly page = 1;
}

type <%= api_name %>Response = PaginatedCollection<{}>;

export const <%= h.changeCase.camel(api_name) %>Api: Api<
  <%= api_name %>Request,
  <%= api_name %>Response,
  UnauthorizedException | ForbiddenException
> = baseModule.api({
  method: 'GET',
  path: '/<%= h.changeCase.param(api_name) %>',
  validator: <%= api_name %>Request,
});
