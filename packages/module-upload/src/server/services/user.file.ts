import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getUserFilesApi } from '../../share';
import { UserFile } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getUserFilesApi)
export class GetUserFilesService extends AuthApiService<
  typeof getUserFilesApi
> {
  async handle(request: InferAuthApiRequest<typeof getUserFilesApi>) {
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
