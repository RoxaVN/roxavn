import { useTranslation } from 'react-i18next';
import { baseModule, BaseModule } from '../../share';

export interface MenuItem {
  label: string;
  path?: string;
  description?: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  children?: Array<MenuItem>;
}

export class WebModule extends BaseModule {
  readonly appMenu: Array<MenuItem> = [];

  resolveStaticPath(path: string) {
    return WebModule.resolveStaticPath(this.name, path);
  }

  useTranslation() {
    return useTranslation(this.escapedName);
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
