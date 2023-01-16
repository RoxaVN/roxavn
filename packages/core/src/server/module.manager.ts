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
      this._currentModule = currentModule;
      const modules = Object.keys({
        ...currentModule.dependencies,
        ...currentModule.peerDependencies,
      })
        .map((module) => getPackageJson(module))
        .filter((m) => 'roxavn' in m);
      if ('roxavn' in currentModule) {
        modules.push(currentModule);
      }
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
