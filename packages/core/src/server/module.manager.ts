import { getPackageJson } from './utils';

interface ModuleInfo {
  name: string;
  version: string;
  author: string;
  roxavn: Record<string, any>;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

class ModuleManager {
  private _modules?: ModuleInfo[];
  private _currentModule?: ModuleInfo;

  init() {
    if (!this._modules) {
      const currentModule = getPackageJson();
      const visited: Array<string> = [];
      const modules: Array<ModuleInfo> = [];

      const visit = (packageInfo: any) => {
        Object.keys({
          ...packageInfo.dependencies,
          ...packageInfo.peerDependencies,
        }).map((m) => {
          if (!visited.includes(m)) {
            const pkgInfo = getPackageJson(m);
            visited.push(m);
            if ('roxavn' in pkgInfo) {
              visit(pkgInfo);
            }
          }
        });
        if ('roxavn' in packageInfo) {
          modules.push(packageInfo);
        }
      };
      visit(currentModule);

      this._currentModule = currentModule;
      this._modules = modules;
    }
  }

  get modules() {
    this.init();
    return this._modules as ModuleInfo[];
  }

  get currentModule() {
    this.init();
    return this._currentModule as ModuleInfo;
  }
}

export const moduleManager = new ModuleManager();
