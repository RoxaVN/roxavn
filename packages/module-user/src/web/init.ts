import { authService, http, uiManager } from '@roxavn/core/web';
import { accessTokenApi, userApi } from '../base';

authService.authenticateApi = userApi.getOne;
authService.logoutApi = accessTokenApi.delete;

http.preSentObserver.subscribe(({ config }) => {
  const data = authService.getTokenData();
  if (data) {
    Object.assign(config.headers, {
      Authorization: `Bearer ${data.accessToken}`,
    });
  }
});
http.errorObserver.subscribe((e) => {
  if (e.data && e.data.code) {
    // ignore application error
    return;
  }
  if (e.response) {
    uiManager.errorModal(new Error(`HTTP ${e.response.status} ${e.message}`));
  }
});
