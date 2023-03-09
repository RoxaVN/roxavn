import isEmpty from 'lodash/isEmpty';
import { Subject } from 'rxjs';

import { Api } from '../../base';
import { apiFetcher } from './api.fetcher';

type TokenData = { id: string; accessToken: string; userId: string };

export class AuthService {
  _tokenData?: TokenData;
  _authData?: Record<string, any>;

  authenticateApi?: Api;
  logoutApi?: Api;

  authObserver = new Subject<Record<string, any> | undefined>();

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
    return this._authData;
  }
  setUser(user?: Record<string, any>) {
    this._authData = user;
  }
  authenticate(token: TokenData): Promise<Record<string, any>> {
    if (this.authenticateApi) {
      return apiFetcher
        .fetch(this.authenticateApi, { userId: token.userId })
        .then((data) => {
          this.setUser(data);
          this.setTokenData(token);
          this.authObserver.next(data);
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
    throw new Error('AuthService.authenticateApi is not set');
  }
  logout(token: TokenData): Promise<boolean> {
    if (this.logoutApi) {
      return apiFetcher
        .fetch(this.logoutApi, { accessTokenId: token.id })
        .then(() => {
          this.setUser(undefined);
          this.removeTokenData();
          this.authObserver.next(undefined);
          return true;
        })
        .catch(() => false);
    }
    throw new Error('AuthService.logoutApi is not set');
  }
}

export const authService = new AuthService();