class I18nClient {
  META_NAMESPACE = 'internal/meta/locales' as const;
  COMMON_NAMESPACE = 'internal/common/locales' as const;
}

export const i18nClient = new I18nClient();
