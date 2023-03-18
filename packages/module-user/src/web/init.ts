import { authService, http, uiManager, userService } from '@roxavn/core/web';
import { lazy } from 'react';
import { accessTokenApi, userApi } from '../base';

authService.authenticateApi = userApi.getOne;
authService.logoutApi = accessTokenApi.delete;

userService.reference.update(userApi.search, (item) => item.username);
userService.input = lazy(() => import('./components/UserInput'));
userService.roleUsers = lazy(() => import('./components/RoleUsers'));

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
