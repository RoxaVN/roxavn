import { json, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import { i18nextServer } from '@roxavn/core/server';
import { createRoot } from '@roxavn/dev-web/web';

export const loader = async ({ request }: LoaderArgs) => {
  const locale = await i18nextServer.getLocale(request);
  return json({ locale });
};

export const meta: V2_MetaFunction = () => [
  {
    charSet: 'utf-8',
  },
  {
    name: 'viewport',
    content: 'width=device-width,initial-scale=1',
  },
];

import * as initModules from './init.modules.js';

export default createRoot({ initModules });
