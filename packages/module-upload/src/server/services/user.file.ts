import {
  AuthApiService,
  InferAuthApiRequest,
} from '@roxavn/module-user/server';

import { getUserFilesApi } from '../../base';
import { UserFile } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(getUserFilesApi)
export class GetUserFilesApiService extends AuthApiService<
  typeof getUserFilesApi
> {
  async handle(request: InferAuthApiRequest<typeof getUserFilesApi>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
      .getRepository(UserFile)
      .findAndCount({
        relations: { user: true },
        select: {
          userId: true,
          currentStorageSize: true,
          maxStorageSize: true,
          maxFileSize: true,
          updatedDate: true,
          user: { username: true },
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
