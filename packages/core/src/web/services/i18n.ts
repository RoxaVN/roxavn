import { Locale } from 'date-fns';
import PrimeReact, { locale, addLocale } from 'primereact/api';

class I18nClient {
  META_NAMESPACE = 'internal/meta/locales' as const;
  COMMON_NAMESPACE = 'internal/common/locales' as const;

  dateFnsLocale?: Locale;

  updatePrimeLocale(
    props: Record<string, any>,
    lang: string,
    i18nKey = '_nextI18Next'
  ) {
    if (i18nKey in props) {
      const data = props[i18nKey];
      if (lang !== PrimeReact.locale) {
        locale(lang);
        addLocale(lang, data.initialI18nStore[lang][this.COMMON_NAMESPACE]);
      }
    }
  }
}

export const i18nClient = new I18nClient();
