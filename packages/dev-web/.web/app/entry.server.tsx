import { injectStyles, createStylesServer } from '@mantine/remix';
import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/server-runtime';
import { moduleManager } from '@roxavn/core/server';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import fs from 'fs';
import { resolve } from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import i18next from './i18next.server';
import i18n from './i18n'; // your i18n configuration file

if (fs.existsSync('./src/server/index.ts')) {
  const { serverModule } = require('../../src/server');
  moduleManager.serverModules.push(serverModule);
}

const server = createStylesServer();

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {
  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  const instance = createInstance();

  // Then we could detect locale from the request
  const lng = await i18next.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  const ns = i18next.getRouteNamespaces(context);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: {
        loadPath: resolve('./public/static/{{ns}}/locales/{{lng}}.json'),
      },
    });

  // Then you can render your app wrapped in the I18nextProvider as in the
  // entry.client file
  const markup = renderToString(
    <I18nextProvider i18n={instance}>
      <RemixServer context={context} url={request.url} />
    </I18nextProvider>
  );

  headers.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + injectStyles(markup, server), {
    status: statusCode,
    headers: headers,
  });
}
