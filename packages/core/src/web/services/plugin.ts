export type PluginRegister = () => Promise<{ default: () => void }>;

class PluginManager {
  private registerMap = new Set();

  async loadRegisters(registers: Array<PluginRegister>) {
    for (const register of registers) {
      const handler = await register();
      if (!this.registerMap.has(handler)) {
        handler.default();
        this.registerMap.add(handler);
      }
    }
  }
}

export const pluginManager = new PluginManager();
