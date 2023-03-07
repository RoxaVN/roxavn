import i18next from 'i18next';

class I18nServer {
  constructor() {
    i18next.init({ resources: {} });
  }

  addScopes(scopes: Record<string, any>, namespace: string) {
    Object.keys(scopes).map((lang) => {
      i18next.addResourceBundle(lang, namespace, scopes[lang]);
    });
    return (key: string, options?: Record<string, unknown>) => {
      return i18next.t(namespace + '.' + key, options || {});
    };
  }
}

export const i18nServer = new I18nServer();
