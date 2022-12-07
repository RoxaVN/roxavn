import { InferApiResponse } from '@roxavn/core/share';
import { apiFetcher } from '@roxavn/core/web';
import isEmpty from 'lodash/isEmpty';
import { Subject } from 'rxjs';
import { GetMyUserApi, LogoutApi } from '../../share';
import { webModule } from '../module';

type AuthData = InferApiResponse<typeof GetMyUserApi>;

export const auth = {
  _authData: {} as AuthData,
  authenticateApi: webModule.api(GetMyUserApi),
  logoutApi: webModule.api(LogoutApi),

  authenticatedObserver: new Subject<AuthData>(),
  logoutObserver: new Subject<undefined>(),

  getToken() {
    return localStorage.getItem('_tk');
  },
  setToken(token: string) {
    localStorage.setItem('_tk', token);
  },
  removeToken() {
    localStorage.removeItem('_tk');
  },
  isAuthenticated() {
    return !isEmpty(this._authData);
  },
  getUser() {
    return this._authData || {};
  },
  setUser(user: AuthData) {
    this._authData = user;
  },
  removeUser() {
    this._authData = {} as AuthData;
  },
  authenticate(token: string): Promise<AuthData> {
    return apiFetcher
      .fetch(this.authenticateApi)
      .then((data) => {
        this.setUser(data);
        this.setToken(token);
        this.authenticatedObserver.next(data);
        return data;
      })
      .catch((e) => {
        const error = apiFetcher.getErrorData(e);
        if (error) {
          this.removeToken();
        }
        throw e;
      });
  },
  logout(): Promise<boolean> {
    return apiFetcher
      .fetch(this.logoutApi)
      .then(() => {
        this.removeUser();
        this.removeToken();
        this.logoutObserver.next(undefined);
        return true;
      })
      .catch(() => false);
  },
};
