import fs from 'fs';
import path from 'path';

/**
 * Gets JSON file content.
 *
 * @param filePath A path to a file.
 */
export const getJsonFromFile = (filePath: string): any => {
  const text = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(text);
};

/**
 * Gets JSON file content.
 *
 * @param filePath A path to a file.
 */
export const getJsonFromFileAsync = async (filePath: string): Promise<any> => {
  const text = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(text);
};

/**
 * Gets `package.json` file content.
 *
 * @param packageDir A package directory.
 */
export const getPackageJson = (packageDir: string) => {
  const filePath = path.join(packageDir, 'package.json');
  return getJsonFromFile(filePath);
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
