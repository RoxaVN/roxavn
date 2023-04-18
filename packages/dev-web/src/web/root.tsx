import { createEmotionCache } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import { json, type LoaderArgs, type MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Outlet,
} from '@remix-run/react';
import { i18nextServer } from '@roxavn/core/server';
import { AppProvider } from '@roxavn/core/web';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18nextServer.getLocale(request);
  return json({ locale });
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

function useChangeLanguage(locale: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export function createRoot() {
  createEmotionCache({ key: 'mantine' });

  return function Root() {
    // Get the locale from the loader
    const { locale } = useLoaderData<typeof loader>();

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
            <script
              src="https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect.min.js"
              integrity="sha512-jvbPH2TH5BSZumEfOJZn9IV+5bSwwN+qG4dvthYe3KCGC3/9HmxZ4phADbt9Pfcp+XSyyfc2vGZ/RMsSUZ9tbQ=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            ></script>
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
