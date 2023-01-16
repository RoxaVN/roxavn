import { moduleManager } from '../module.manager';

export async function runModuleHooks(mode: string) {
  for (const m of moduleManager.modules) {
    await runModuleHook(m.name, mode);
  }
}

export async function runModuleHook(module: string, mode: string) {
  let hook;
  try {
    hook = require(module + '/hook');
  } catch (e) {}
  if (hook) {
    await hook[mode]();
  }
}
