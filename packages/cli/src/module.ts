import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { BaseModule, constants } from '@roxavn/core/share';
import { moduleManager } from '@roxavn/core/server';

import { CodeChanger } from './lib';

class ModuleService {
  sync() {
    this.initWebFolder();
    moduleManager.modules.map((module) => this.syncModule(module.name));
  }

  syncModule(module: string) {
    const staticPath = this.getStaticPath(module);
    if (staticPath) {
      this.syncStatic(module, staticPath);
      this.syncMetaLoacale(module, staticPath);
    }
    this.addInit(module);
    console.log('Sync ' + module);
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

  syncStatic(module: string, staticPath: string) {
    this.createStaticLink(BaseModule.escapeName(module), staticPath);
  }

  syncMetaLoacale(module: string, staticPath: string) {
    const localesPath = path.join(staticPath, 'locales');
    const files = fs.readdirSync(localesPath);
    for (const file of files) {
      const srcFile = path.join(localesPath, file);
      const targetFile = path.join(
        '.web/public/static',
        constants.META_I18N_NAMESPACE,
        'locales',
        file
      );
      let data: Record<string, any> = {};
      if (fs.existsSync(targetFile)) {
        data = fse.readJSONSync(targetFile, { throws: false }) || {};
      } else {
        fse.ensureFileSync(targetFile);
      }
      const localesData = fse.readJSONSync(srcFile);
      if (localesData.Meta) {
        data[module] = localesData.Meta;
        fse.writeJSONSync(targetFile, data);
      }
    }
  }

  addInit(module: string) {
    const webPath =
      module === moduleManager.currentModule.name
        ? 'src/web'
        : path.dirname(require.resolve(module + '/web'));
    if (
      fs.existsSync(`${webPath}/init.ts`) ||
      fs.existsSync(`${webPath}/init.tsx`) ||
      fs.existsSync(`${webPath}/init.js`) ||
      fs.existsSync(`${webPath}/init.jsx`)
    ) {
      new CodeChanger(
        '.web/app/init.client.ts',
        '// start block',
        '// end block'
      )
        .removeLines(module)
        .removeLines('../../src/web/init')
        .insertEnd(
          module === moduleManager.currentModule.name
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

  getStaticPath(moduleName: string): string | null {
    let staticPath: string | null;
    if (moduleName !== moduleManager.currentModule.name) {
      staticPath = this.getPackageRootPath(moduleName + '/web');
      if (staticPath) {
        staticPath = path.join(staticPath, 'static');
      }
    } else {
      staticPath = 'static';
    }
    return staticPath ? (fs.existsSync(staticPath) ? staticPath : null) : null;
  }

  initWebFolder() {
    if (fs.existsSync('.web')) {
      fs.rmSync('.web', { recursive: true, force: true });
    }
    const webModulePath = path.dirname(require.resolve('@roxavn/dev-web'));
    fse.copySync(path.join(webModulePath, '.web'), '.web');
  }
}

export const moduleService = new ModuleService();
