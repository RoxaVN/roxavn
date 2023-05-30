import { createEmotionCache } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Outlet,
} from '@remix-run/react';
import { AppProvider } from '@roxavn/core/web';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function useChangeLanguage(locale: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export function createRoot({
  initModules,
}: {
  initModules: Record<string, () => void>;
}) {
  createEmotionCache({ key: 'mantine' });
  for (const k in initModules) {
    initModules[k]();
  }

  return function Root() {
    // Get the locale from the loader
    const { locale } = useLoaderData();

    const { i18n } = useTranslation();

    // This hook will change the i18n instance language to the current locale
    // detected by the loader, this way, when we do something to change the
    // language, this locale will change and i18next will load the correct
    // translation files
    useChangeLanguage(locale);

    return (
      <AppProvider>
        <html lang={locale} dir={i18n.dir()}>
          <head>
            <StylesPlaceholder />
            <Meta />
            <Links />
          </head>
          <body>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </body>
        </html>
      </AppProvider>
    );
  };
}
