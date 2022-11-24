import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import { BaseModule } from '@roxavn/core/share';
import { getJsonFromFile } from '@roxavn/core/server';

class ModuleService {
  sync() {
    const config = getJsonFromFile('.app.config.json');
    Object.keys(config.modules).map((module) => this.syncModule(module));
  }

  syncModule(module: string) {
    const webPath = path.dirname(require.resolve(module + '/web'));
    const staticPath = path.join(path.dirname(path.dirname(webPath)), 'static');
    this.createStaticLink(BaseModule.escapeName(module), staticPath);
  }

  createStaticLink(targetName: string, srcPath: string) {
    const targetFolder = 'public/static';
    fse.ensureDirSync(targetFolder);

    const currentDir = process.cwd();
    const relativePath = path.relative(targetFolder, srcPath);

    process.chdir(targetFolder);
    if (fs.lstatSync(targetName)) {
      fs.unlinkSync(targetName);
    }
    fs.symlinkSync(relativePath, targetName);
    process.chdir(currentDir);
  }
}

export const moduleService = new ModuleService();
