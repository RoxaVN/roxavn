import { http, uiManager } from '@roxavn/core/web';
import { auth } from './services';

http.preSentObserver.subscribe(({ config }) => {
  const token = auth.getToken();
  if (token) {
    Object.assign(config.headers, { Authorization: `Bearer ${token}` });
  }
});
http.errorObserver.subscribe((e) => {
  if (e.data && e.data.code) {
    // ignore application error
    return;
  }
  if (e.response) {
    uiManager.errorDialog(new Error(`HTTP ${e.response.status} ${e.message}`));
  }
});
