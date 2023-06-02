import fs from 'fs';
import path from 'path';
import { ServerModule } from './module.js';
import { getPackageJson, resolveModule } from './utils/index.js';
import { constants } from '../base/index.js';

interface ModuleInfo {
  name: string;
  version: string;
  author: string;
  roxavn: Record<string, any>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

class ModuleManager {
  readonly serverModules: ServerModule[] = [];

  currentServerModuleImporter = async () => {
    return await import(this.currentModule.name + '/server');
  };

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
          ...(process.env.NODE_ENV === constants.ENV_DEVELOPMENT
            ? packageInfo.devDependencies
            : {}),
        }).map((m) => {
          if (!visited.includes(m)) {
            let pkgInfo = {};
            try {
              pkgInfo = getPackageJson(m);
            } catch {}
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
              : resolveModule(m.name + '/web');
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

  async importServerModules() {
    await Promise.all(
      this.modules.map(async (module) => {
        try {
          let m;
          if (module.name !== this.currentModule.name) {
            m = await import(module.name + '/server');
          } else {
            m = await this.currentServerModuleImporter();
          }
          this.serverModules.push(m.serverModule);
        } catch (e: any) {
          if (e?.code !== 'MODULE_NOT_FOUND') {
            console.log(e);
          }
        }
      })
    );
  }
}

export const moduleManager = new ModuleManager();
