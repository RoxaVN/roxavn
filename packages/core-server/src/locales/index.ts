import { i18nServer } from 'src/i18n';
import { en } from './en';
import { vi } from './vi';

export const t = i18nServer.addResources({ en, vi }, 'core-server');
