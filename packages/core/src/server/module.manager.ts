import fs from 'fs';
import path from 'path';
import { ServerModule } from './module';
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
  readonly serverModules: ServerModule[] = [];

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

  getModulesHaveMePages() {
    return this.modules
      .filter((m) => {
        try {
          const modulePath =
            m.name === this.currentModule.name
              ? './src/web/index.ts'
              : require.resolve(m.name + '/web');
          const pagesPath = path.join(
            path.dirname(modulePath),
            'pages/me/{moduleName}'
          );
          return fs.existsSync(pagesPath);
        } catch (e) {
          return false;
        }
      })
      .map((m) => m.name);
  }

  async getModulesHaveAppPages() {
    const result: { name: string; path: string }[] = [];
    for (const serverModule of this.serverModules) {
      try {
        if (serverModule.options?.appPath) {
          result.push({
            name: serverModule.name,
            path: serverModule.options?.appPath,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
    return result;
  }
}

export const moduleManager = new ModuleManager();
