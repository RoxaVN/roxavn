import { useTranslation } from 'react-i18next';
import { BaseModule } from '../../share';

class WebModule {
  readonly base: BaseModule;

  constructor(module: BaseModule) {
    this.base = module;
  }

  resolveStaticPath(path: string) {
    return WebModule.resolveStaticPath(this.base.name, path);
  }

  static resolveStaticPath(moduleName: string, path: string) {
    if (path.startsWith('/')) {
      return `/static/${BaseModule.escapeName(moduleName)}${path}`;
    }
    return path;
  }

  useTranslation() {
    return useTranslation(this.base.escapedName);
  }
}

export { WebModule };
