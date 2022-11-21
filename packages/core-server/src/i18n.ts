import i18next from 'i18next';

class I18nServer {
  constructor() {
    i18next.init({ resources: {} });
  }

  addResources(resources: Record<string, any>, namespace: string) {
    Object.keys(resources).map((lang) => {
      i18next.addResourceBundle(lang, namespace, resources[lang]);
    });
    return (key: string, options?: Record<string, unknown>) => {
      return i18next.t(namespace + '.' + key, options);
    };
  }
}

export const i18nServer = new I18nServer();
