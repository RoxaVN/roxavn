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
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },
  remove: function (name: string) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },
};
