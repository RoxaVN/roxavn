import {
  BadRequestException,
  ExpiredException,
  NotFoundException,
} from '@roxavn/core/base';
import {
  BaseService,
  InjectDatabaseService,
  inject,
} from '@roxavn/core/server';
import { eth } from 'web3';

import { Web3Auth } from '../entities/web3.auth.entity.js';
import { serverModule } from '../module.js';

@serverModule.injectable()
export class GetWeb3AuthService extends InjectDatabaseService {
  async handle(request: { web3AuthId: string }) {
    const web3auth = await this.entityManager.getRepository(Web3Auth).findOne({
      where: {
        id: request.web3AuthId,
      },
    });
    if (web3auth) {
      return web3auth;
    }
    throw new NotFoundException();
  }
}

@serverModule.injectable()
export class DeleteWeb3AuthService extends InjectDatabaseService {
  async handle(request: { web3AuthId: string }) {
    await this.entityManager.getRepository(Web3Auth).delete({
      id: request.web3AuthId,
    });
    return {};
  }
}

@serverModule.injectable()
export class Web3AuthService extends BaseService {
  constructor(
    @inject(GetWeb3AuthService) private getWeb3AuthService: GetWeb3AuthService,
    @inject(DeleteWeb3AuthService)
    private deleteWeb3AuthService: DeleteWeb3AuthService
  ) {
    super();
  }

  async handle(request: { web3AuthId: string; signature: string }) {
    const web3auth = await this.getWeb3AuthService.handle({
      web3AuthId: request.web3AuthId,
    });
    const now = new Date();
    if (now.getTime() - web3auth.createdDate.getTime() > 15 * 60 * 1000) {
      // expire after 15 minutes
      throw new ExpiredException();
    }

    const address = eth.accounts.recover(web3auth.message, request.signature);
    if (address.toLowerCase() !== web3auth.address.toLowerCase()) {
      throw new BadRequestException();
    }
    // delete if auth success
    await this.deleteWeb3AuthService.handle({ web3AuthId: request.web3AuthId });
    return {};
  }
}
