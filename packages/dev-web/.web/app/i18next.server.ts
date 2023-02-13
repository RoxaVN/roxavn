import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import i18n from './i18n';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng,
  },
  // This is the configuration for i18next used
  // when translating messages server-side only
  i18next: {
    ...i18n,
    backend: {
      loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json'),
    },
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `scopes` to the `i18next` configuration and avoid
  // a backend here
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  backend: Backend,
});

export default i18next;
