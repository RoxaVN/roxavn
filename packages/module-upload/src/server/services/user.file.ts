import { useApi } from '@roxavn/core/server';
import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { GetUserFilesApi } from '../../share';
import { UserFile } from '../entities';
import { serverModule } from '../module';

@useApi(serverModule, GetUserFilesApi)
export class GetUsersApiService extends AuthApiService<typeof GetUserFilesApi> {
  async handle(request: InferAuthApiRequest<typeof GetUserFilesApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dataSource
      .getRepository(UserFile)
      .findAndCount({
        relations: { owner: true },
        select: {
          ownerId: true,
          currentStorageSize: true,
          maxStorageSize: true,
          maxFileSize: true,
          updatedDate: true,
          owner: { username: true },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
      });

    return {
      items: users,
      pagination: { page, pageSize, totalItems },
    };
  }
}
