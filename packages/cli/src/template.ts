import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

class TemplateService {
  createPackage() {
    this.initWebFolder();
  }

  initWebFolder() {
    if (fs.existsSync('.web')) {
      fs.rmSync('.web', { recursive: true, force: true });
    }
    const webModulePath = path.dirname(require.resolve('@roxavn/web-erp'));
    fse.copySync(path.join(webModulePath, '.web'), '.web');
  }
}

export const templateService = new TemplateService();
