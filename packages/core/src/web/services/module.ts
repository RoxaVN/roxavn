import { useEffect } from 'react';
import { useTranslation, TFunction } from 'react-i18next';
import { useOutletContext, useRoutes } from 'react-router-dom';

import { baseModule, BaseModule } from '../../base';

export interface PageItem {
  label?: React.ReactNode | { (t: TFunction): React.ReactNode };
  description?: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  path?: string;
  element?: React.ReactElement;
  children?: Array<PageItem>;
}

export class WebModule extends BaseModule {
  readonly adminPages: Array<PageItem> = [];
  readonly mePages: Array<PageItem> = [];

  resolveStaticPath(path: string) {
    return WebModule.resolveStaticPath(this.name, path);
  }

  useTranslation() {
    return useTranslation(this.escapedName);
  }

  makeAdminPages() {
    return () => {
      const { setWebModule } = useOutletContext<any>();
      const element = useRoutes(this.adminPages);

      useEffect(() => {
        setWebModule(this);
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
}

export const webModule = WebModule.fromBase(baseModule);
