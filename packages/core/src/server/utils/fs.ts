import fs from 'fs';
import fse from 'fs-extra';
import { createRequire } from 'node:module';
import path from 'path';

const nodeRequire = createRequire(import.meta.url);

export const resolveModule = (module: string) => {
  return nodeRequire.resolve(module);
};

/**
 * Gets `package.json` file content of module
 */
export const getPackageJson = (module?: string) => {
  const filePath = module ? getPackageRootPath(module) : '';
  return fse.readJSONSync(path.join(filePath, 'package.json'));
};

export const getPackageRootPath = (module: string) => {
  let modulePath = resolveModule(module);
  while (modulePath.length > 1) {
    modulePath = path.dirname(modulePath);
    if (fs.existsSync(path.join(modulePath, 'package.json'))) {
      return modulePath;
    }
  }
  throw Error("Can't find package.json of module " + module);
};

export const visitFiles = (
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir
) => {
  for (const filename of fs.readdirSync(dir)) {
    const file = path.resolve(dir, filename);
    const stat = fs.lstatSync(file);

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir);
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file));
    }
  }
};
