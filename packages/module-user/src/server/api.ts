import { Apis } from '../share/apis';
import { serverModule } from './module';

export function useApis() {
  serverModule.useApi(Apis.Login, () => ({ accessToken: '200' }));
}
