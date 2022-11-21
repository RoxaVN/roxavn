const urlUtils = {
  removeTrailingSlash(url: string) {
    if (url === '/') {
      return url;
    }
    return url.endsWith('/') ? url.slice(0, url.length - 1) : url;
  },

  matchPattern(pattern1: string, pattern2: string, trailingSlash = true) {
    if (trailingSlash) {
      pattern1 = this.removeTrailingSlash(pattern1);
      pattern2 = this.removeTrailingSlash(pattern2);
    }
    const parts1 = pattern1.split('/');
    const parts2 = pattern2.split('/');
    if (trailingSlash) {
      if (parts1.length === parts2.length + 1) {
        parts2.push('');
      } else if (parts1.length + 1 === parts2.length) {
        parts1.push('');
      }
    }
    if (parts1.length === parts2.length) {
      for (let i = 0; i < parts1.length; i += 1) {
        if (
          !parts1[i].startsWith(':') &&
          !parts2[i].startsWith(':') &&
          parts1[i] !== parts2[i]
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  },

  match(url: string, urlPattern: string, trailingSlash = true) {
    if (trailingSlash) {
      urlPattern = this.removeTrailingSlash(urlPattern);
      url = this.removeTrailingSlash(url);
    }
    const urlParts = url.split('/');
    const urlPatternParts = urlPattern.split('/');
    if (trailingSlash) {
      if (urlParts.length === urlPatternParts.length + 1) {
        urlPatternParts.push('');
      } else if (urlParts.length + 1 === urlPatternParts.length) {
        urlParts.push('');
      }
    }
    if (urlParts.length === urlPatternParts.length) {
      const params: Record<string, string> = {};
      for (let i = 0; i < urlParts.length; i += 1) {
        if (urlPatternParts[i].startsWith(':')) {
          params[urlPatternParts[i].slice(1)] = urlParts[i];
        } else if (urlPatternParts[i] !== urlParts[i]) {
          return null;
        }
      }
      return params;
    }
    return null;
  },

  gen(urlPattern: string, params: Record<string, any>) {
    const parts = urlPattern.split('/');
    const result = [] as string[];
    for (let i = 0; i < parts.length; i += 1) {
      if (parts[i].startsWith(':')) {
        const key = parts[i].slice(1);
        result.push(params[key]);
      } else {
        result.push(parts[i]);
      }
    }
    return result.join('/');
  },
};

export { urlUtils };
