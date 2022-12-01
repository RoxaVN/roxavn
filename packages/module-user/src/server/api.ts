import { Apis } from '../share/apis';
import { serverModule } from './module';
import { LoginApiService } from './services';

export function useApis() {
  serverModule.useService(Apis.Login, LoginApiService);
}
