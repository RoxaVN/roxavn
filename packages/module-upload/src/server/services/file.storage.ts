import { InferApiRequest } from '@roxavn/core/base';
import { ApiService } from '@roxavn/core/server';

import { fileStoageApi } from '../../base';
import { FileStorage } from '../entities';
import { serverModule } from '../module';

@serverModule.useApi(fileStoageApi.getMany)
export class GetUserFilesApiService extends ApiService {
  async handle(request: InferApiRequest<typeof fileStoageApi.getMany>) {
    const page = request.page || 1;
    const pageSize = 10;

    const [users, totalItems] = await this.dbSession
      .getRepository(FileStorage)
      .findAndCount({
        select: {
          userId: true,
          currentSize: true,
          maxSize: true,
          maxFileSize: true,
          updatedDate: true,
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
