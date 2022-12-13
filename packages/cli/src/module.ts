import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { BaseModule } from '@roxavn/core/share';
import { appConfig, getJsonFromFile } from '@roxavn/core/server';

import { CodeChanger } from './lib';

class ModuleService {
  sync() {
    Object.keys(appConfig.get().modules).map((module) =>
      this.syncModule(module)
    );
  }

  syncModule(module: string) {
    this.syncStatic(module);
    this.addInit(module);
  }

  getPackageRootPath(module: string) {
    let modulePath = require.resolve(module);
    while (modulePath.length > 1) {
      modulePath = path.dirname(modulePath);
      if (fs.existsSync(path.join(modulePath, 'package.json'))) {
        return modulePath;
      }
    }
    return null;
  }

  syncStatic(module: string) {
    const staticPath =
      module === '.' ? 'static' : this.getPackageRootPath(module + '/web');
    if (staticPath) {
      const moduleName = this.realModuleName(module);
      this.createStaticLink(BaseModule.escapeName(moduleName), staticPath);
    }
  }

  addInit(module: string) {
    const webPath =
      module === '.'
        ? 'src/web'
        : path.dirname(require.resolve(module + '/web'));
    if (
      fs.existsSync(`${webPath}/init.ts`) ||
      fs.existsSync(`${webPath}/init.tsx`) ||
      fs.existsSync(`${webPath}/init.js`) ||
      fs.existsSync(`${webPath}/init.jsx`)
    ) {
      const moduleName = this.realModuleName(module);
      new CodeChanger(
        '.web/app/init.client.ts',
        '// start block',
        '// end block'
      )
        .removeLines(moduleName)
        .removeLines('../../src/web/init')
        .insertEnd(
          module === '.'
            ? `import '../../src/web/init';`
            : `import '${module}/web/init';`
        )
        .save();
    }
  }

  createStaticLink(targetName: string, srcPath: string) {
    const targetFolder = '.web/public/static';
    fse.ensureDirSync(targetFolder);

    const currentDir = process.cwd();
    const relativePath = path.relative(targetFolder, srcPath);

    process.chdir(targetFolder);
    try {
      fs.unlinkSync(targetName);
    } catch (e) {}
    fs.symlinkSync(relativePath, targetName);
    process.chdir(currentDir);
  }

  realModuleName(moduleName: string): string {
    if (moduleName === '.') {
      const packageInfo = getJsonFromFile('package.json');
      return packageInfo.name;
    }
    return moduleName;
  }
}

export const moduleService = new ModuleService();
