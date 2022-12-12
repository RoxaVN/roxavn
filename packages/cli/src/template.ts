import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

class TemplateService {
  createPackage() {
    this.initWebFolder();
    this.writeIgnore();
  }

  initWebFolder() {
    if (fs.existsSync('.web')) {
      fs.rmSync('.web', { recursive: true, force: true });
    }
    const webModulePath = path.dirname(require.resolve('@roxavn/web-erp'));
    fse.copySync(path.join(webModulePath, '.web'), '.web');
    fse.copyFileSync(
      path.join(webModulePath, 'tsconfig.json'),
      'tsconfig.json'
    );
  }

  writeIgnore() {
    fs.writeFileSync(
      '.gitignore',
      `/dist
/node_modules
/.web
`
    );
  }
}

export const templateService = new TemplateService();
