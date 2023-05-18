import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';

const visitFiles = (dir, visitor, baseDir = dir) => {
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

function parseFile(filePath) {
  console.log(filePath);
  const data = fse.readFileSync(filePath, { encoding: 'utf-8' });
  const lines = data.split('\n');
  const regex = /from \'(?<importFile>.*)\'\;$/;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(regex);
    if (match && match.groups) {
      const importFile = match.groups.importFile;
      if (importFile.startsWith('.') && !importFile.endsWith('.js')) {
        const importFilePath = path.join(
          path.dirname(filePath) + '/',
          importFile
        );
        let newImportFile = '';
        if (fs.existsSync(importFilePath)) {
          newImportFile = importFile + '/index.js';
        } else if (
          fs.existsSync(importFilePath + '.ts') ||
          fs.existsSync(importFilePath + '.tsx')
        ) {
          newImportFile = importFile + '.js';
        } else {
          throw new Error('Invalid ' + importFilePath);
        }
        if (newImportFile) {
          lines[i] = lines[i].replace(regex, `from '${newImportFile}';`);
        }
      }
    }
  }
  fse.writeFileSync(filePath, lines.join('\n'), { encoding: 'utf-8' });
}
// visitFiles(process.argv[2], parseFile);

visitFiles(
  '/home/woody/Documents/noop/packages/dev-web/src',
  parseFile,
  process.cwd()
);
