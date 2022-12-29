import { appConfig } from '../app.config';

export async function runModuleHooks(mode: string) {
  const modules = Object.keys(appConfig.data.modules);
  for (const m of modules) {
    await runModuleHook(m, mode);
  }
}

export async function runModuleHook(module: string, mode: string) {
  if (module === '.') {
    module = appConfig.currentModule;
  }
  let hook;
  try {
    hook = require(module + '/hook');
  } catch (e) {}
  if (hook) {
    await hook[mode]();
  }
}
