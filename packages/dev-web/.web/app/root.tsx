import { json, type MetaFunction, type LoaderFunction } from '@remix-run/node';
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
import i18next from './i18next.server';
import { createEmotionCache } from '@mantine/core';
import { StylesPlaceholder } from '@mantine/remix';
import React, { useEffect } from 'react';

import './init.client';

type LoaderData = { locale: string };
createEmotionCache({ key: 'mantine' });

export const loader: LoaderFunction = async ({ request }) => {
  const locale = await i18next.getLocale(request);
  return json<LoaderData>({ locale });
};

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

function useChangeLanguage(locale: string) {
  let { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
}

export default function Root() {
  // Get the locale from the loader
  const { locale } = useLoaderData<LoaderData>();

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
}
