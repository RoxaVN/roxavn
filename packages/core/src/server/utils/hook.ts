import { appConfig } from '../app.config';

export function runModuleHooks(mode: string) {
  Object.keys(appConfig.data.modules).map((m) => runModuleHook(m, mode));
}

export function runModuleHook(module: string, mode: string) {
  if (module === '.') {
    module = appConfig.currentModule;
  }
  let hook;
  try {
    hook = require(module + '/hook');
  } catch (e) {}
  if (hook) {
    hook[mode]();
  }
}
