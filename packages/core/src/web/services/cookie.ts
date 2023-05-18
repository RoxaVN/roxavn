import { Cookie } from '../../base/index.js';

export const cookieService = {
  set: function (
    name: string,
    value: string,
    options?: { days?: number; sameSite?: 'None' | 'Lax' | 'Strict' }
  ) {
    let cookie = name + '=' + value + '; Path=/';
    if (options?.days) {
      const date = new Date();
      date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookie += '; Expires=' + date.toUTCString();
    }
    if (options?.sameSite) {
      cookie += '; SameSite=' + options.sameSite;
    }
    document.cookie = cookie;
  },
  get: function (name: string) {
    return new Cookie(document.cookie).get(name);
  },
  remove: function (name: string) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
};
