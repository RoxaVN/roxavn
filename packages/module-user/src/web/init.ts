import { http, uiManager } from '@roxavn/core/web';
import { authProvider } from './services';

http.preSentObserver.subscribe(({ config }) => {
  const data = authProvider.getTokenData();
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
