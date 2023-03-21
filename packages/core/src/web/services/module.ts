import { IconSettings } from '@tabler/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useRoutes } from 'react-router-dom';

import { baseModule, BaseModule } from '../../base';
import { PageItem } from './page';

export interface AdminSettings {
  [name: string]: {
    title: React.ReactNode;
    description?: React.ReactNode;
    form: React.ReactElement;
  };
}

export class WebModule extends BaseModule {
  readonly adminPluginRegisters: Array<() => Promise<() => void>> = [];
  readonly adminSettings: AdminSettings = {};
  readonly adminPages: Array<PageItem> = [];

  readonly mePluginRegisters: Array<() => Promise<() => void>> = [];
  readonly mePages: Array<PageItem> = [];

  resolveStaticPath(path: string) {
    return WebModule.resolveStaticPath(this.name, path);
  }

  useTranslation() {
    return useTranslation(this.escapedName);
  }

  makeAdminPages(adminPages: Record<string, PageItem>) {
    this.adminPages.push(
      ...Object.values(adminPages).filter((p) => p instanceof PageItem)
    );
    return () => {
      const { t } = webModule.useTranslation();
      const [pages, setPages] = useState(this.adminPages);
      const { setWebModule } = useOutletContext<any>();
      const element = useRoutes(pages);

      const load = async () => {
        for (const register of this.adminPluginRegisters) {
          const handler = await register();
          handler();
        }
        if (
          !this.adminPages.find((p) => p.path === '/settings') &&
          Object.keys(this.adminSettings).length
        ) {
          this.adminPages.push({
            label: t('settings'),
            icon: IconSettings,
            path: '/settings',
            element: WebModule.settingsPageRender(this),
          });
        }
        setPages([...this.adminPages]);
        setWebModule(this);
      };

      useEffect(() => {
        load();
      }, []);

      return element;
    };
  }

  makeMePages(mePages: Record<string, PageItem>) {
    this.mePages.push(
      ...Object.values(mePages).filter((p) => p instanceof PageItem)
    );
    return () => {
      const [pages, setPages] = useState(this.mePages);
      const { setWebModule } = useOutletContext<any>();
      const element = useRoutes(pages);

      const load = async () => {
        for (const register of this.mePluginRegisters) {
          const handler = await register();
          handler();
        }
        setPages([...this.mePages]);
        setWebModule(this);
      };

      useEffect(() => {
        load();
      }, []);

      return element;
    };
  }

  static resolveStaticPath(moduleName: string, path: string) {
    if (path.startsWith('/')) {
      return `/static/${BaseModule.escapeName(moduleName)}${path}`;
    }
    return path;
  }

  static fromBase(base: BaseModule) {
    return new WebModule(base.name);
  }

  static settingsPageRenderRegister = (): Promise<any> => {
    throw new Error('[settingsPageRenderRegister] Not implement');
  };

  static settingsPageRender = (module: WebModule): React.ReactElement => {
    throw new Error('[settingsPageRender] Not implement ' + module.name);
  };
}

export const webModule = WebModule.fromBase(baseModule);
