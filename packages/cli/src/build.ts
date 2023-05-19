import { visitFiles, getPackageJson } from '@roxavn/core/server';
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import ts from 'typescript';

class BuildService {
  reportDiagnostics(diagnostics: ts.Diagnostic[]) {
    diagnostics.forEach((diagnostic) => {
      let message = 'Error';
      if (diagnostic.file && diagnostic.start) {
        const { line, character } =
          diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        message += ` ${diagnostic.file.fileName} (${line + 1},${
          character + 1
        })`;
      }
      message +=
        ': ' + ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      console.log(message);
    });
  }

  parseConfig(config: any) {
    const configParseResult = ts.parseJsonConfigFileContent(
      config,
      ts.sys,
      process.cwd()
    );
    if (configParseResult.errors.length > 0) {
      this.reportDiagnostics(configParseResult.errors);
      return;
    }
    return configParseResult;
  }

  compileWithConfig(rawConfig: Record<string, any>) {
    const config = this.parseConfig(rawConfig);
    if (config) {
      // Compile
      const program = ts.createProgram(config.fileNames, config.options);
      const emitResult = program.emit();

      // Report errors
      this.reportDiagnostics(
        ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
      );
    }
  }

  removeOldFiles(buildPath: string) {
    visitFiles(
      buildPath,
      (filePath: string) => {
        if (filePath.endsWith('.js')) {
          const source = path.join('./src', filePath.slice(0, -3));
          if (
            !(fs.existsSync(source + '.ts') || fs.existsSync(source + '.tsx'))
          ) {
            fs.rmSync(path.join(buildPath, filePath));
          }
        }
      },
      buildPath
    );
  }

  parseRelativeImports(buildPath: string) {
    const regex = /from \'(?<importFile>.*)\'\;$/;
    const modules = [
      { path: 'base/index.js', module: 'base' },
      { path: 'server/index.js', module: 'server' },
    ].map((item) => ({
      path: item.path,
      module: item.module,
      fullPath: path.resolve(buildPath, item.path),
    }));
    const packageJson = getPackageJson();

    visitFiles(path.join(buildPath, 'web/pages'), (filePath: string) => {
      const data = fse.readFileSync(filePath, { encoding: 'utf-8' });
      const lines = data.split('\n');
      let parsed = false;

      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const match = line.match(regex);
        if (match && match.groups) {
          const importFile = match.groups.importFile;
          if (importFile.startsWith('..')) {
            modules.find((item) => {
              if (
                importFile.endsWith(item.path) &&
                path.resolve(path.dirname(filePath), importFile) ===
                  item.fullPath
              ) {
                if (!parsed) {
                  console.log(filePath);
                }
                const newImport = packageJson.name + '/' + item.module;
                console.log(`  ${importFile} >>> ${newImport}`);
                lines[i] = lines[i].replace(regex, `from '${newImport}';`);
                parsed = true;
                return true;
              }
              return false;
            });
          }
        }
      }

      if (parsed) {
        fse.writeFileSync(filePath, lines.join('\n'), { encoding: 'utf-8' });
      }
    });
  }

  compile() {
    const outDir = 'dist/esm';
    const esmConfig = {
      compilerOptions: {
        outDir,
        target: 'esnext',
        module: 'esnext',
        lib: ['dom', 'dom.iterable', 'esnext'],
        jsx: 'react-jsx',
        declaration: true,
        moduleResolution: 'node',
        noUnusedLocals: true,
        esModuleInterop: true,
        noImplicitReturns: true,
        noImplicitThis: true,
        noImplicitAny: true,
        strictNullChecks: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        emitDecoratorMetadata: true,
        strictPropertyInitialization: false,
        strict: true,
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
    console.log('Build es module');
    this.compileWithConfig(esmConfig);
    this.removeOldFiles(outDir);
    this.parseRelativeImports(outDir);
  }
}

export const buildService = new BuildService();
