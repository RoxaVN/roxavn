import { InferApiResponse } from '@roxavn/core/base';
import { apiFetcher } from '@roxavn/core/web';
import isEmpty from 'lodash/isEmpty';
import { Subject } from 'rxjs';
import { userApi, accessTokenApi } from '../../base';

export type AuthData = InferApiResponse<typeof userApi.getOne>;
type TokenData = { id: string; accessToken: string; userId: string };

export class AuthProvider {
  _tokenData?: TokenData;
  _authData = {} as AuthData;

  authenticateApi = userApi.getOne;
  logoutApi = accessTokenApi.delete;

  authenticatedObserver = new Subject<AuthData>();
  logoutObserver = new Subject<undefined>();

  getTokenData() {
    if (this._tokenData) {
      return this._tokenData;
    }
    try {
      this._tokenData = JSON.parse(localStorage.getItem('_tk') || 'null');
    } catch {
    } finally {
      return this._tokenData;
    }
  }
  setTokenData(tokenData: TokenData) {
    this._tokenData = tokenData;
    localStorage.setItem('_tk', JSON.stringify(tokenData));
  }
  removeTokenData() {
    localStorage.removeItem('_tk');
  }
  isAuthenticated() {
    return !isEmpty(this._authData);
  }
  getUser() {
    return this._authData || {};
  }
  setUser(user: AuthData) {
    this._authData = user;
  }
  removeUser() {
    this._authData = {} as AuthData;
  }
  authenticate(token: TokenData): Promise<AuthData> {
    return apiFetcher
      .fetch(this.authenticateApi, { userId: token.userId })
      .then((data) => {
        this.setUser(data);
        this.setTokenData(token);
        this.authenticatedObserver.next(data);
        return data;
      })
      .catch((e) => {
        const error = apiFetcher.getErrorData(e);
        if (error) {
          this.removeTokenData();
        }
        throw e;
      });
  }
  logout(token: TokenData): Promise<boolean> {
    return apiFetcher
      .fetch(this.logoutApi, { accessTokenId: token.id })
      .then(() => {
        this.removeUser();
        this.removeTokenData();
        this.logoutObserver.next(undefined);
        return true;
      })
      .catch(() => false);
  }
}

export const authProvider = new AuthProvider();
