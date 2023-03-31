import { IconSettings } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useOutletContext, useRoutes } from 'react-router-dom';

import { baseModule, BaseModule } from '../../base';
import { PageItem } from './page';

export interface AdminSettings {
  [name: string]: {
    title: React.ReactNode;
    description?: React.ReactNode;
    form: React.ReactElement;
  };
}

type PluginRegister = () => Promise<{ default: () => void }>;

export class WebModule extends BaseModule {
  readonly adminPluginRegisters: Array<PluginRegister> = [];
  readonly adminSettings: AdminSettings = {};
  readonly adminPages: Array<PageItem> = [];

  readonly mePluginRegisters: Array<PluginRegister> = [];
  readonly mePages: Array<PageItem> = [];

  readonly appPluginRegisters: Array<PluginRegister> = [];
  readonly appPages: Array<PageItem> = [];

  private registerMap = new Map();

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
        await this.loadRegisters(this.adminPluginRegisters);
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
        await this.loadRegisters(this.mePluginRegisters);
        setPages([...this.mePages]);
        setWebModule(this);
      };

      useEffect(() => {
        load();
      }, []);

      return element;
    };
  }

  makeAppPages(appPages: [PageItem]) {
    this.appPages.push(...appPages);
    return () => {
      const { setWebModule } = useOutletContext<any>();

      const load = async () => {
        await this.loadRegisters(this.appPluginRegisters);
        setWebModule(this);
      };

      useEffect(() => {
        load();
      }, []);

      return <Outlet />;
    };
  }

  private async loadRegisters(registers: Array<PluginRegister>) {
    for (const register of registers) {
      const handler = await register();
      if (!this.registerMap.get(handler)) {
        handler.default();
        this.registerMap.set(handler, true);
      }
    }
  }

  static resolveStaticPath(moduleName: string, path: string) {
    if (path.startsWith('/')) {
      return `/static/${BaseModule.escapeName(moduleName)}${path}`;
    }
    return path;
  }

  static fromBase(base: BaseModule) {
    return new WebModule(base.name, base.options);
  }

  static settingsPageRenderRegister = (): Promise<any> => {
    throw new Error('[settingsPageRenderRegister] Not implement');
  };

  static settingsPageRender = (module: WebModule): React.ReactElement => {
    throw new Error('[settingsPageRender] Not implement ' + module.name);
  };
}

export const webModule = WebModule.fromBase(baseModule);
