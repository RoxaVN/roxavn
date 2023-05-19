import { visitFiles } from '@roxavn/core/server';
import fs from 'fs';
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

  compile() {
    const esmConfig = {
      compilerOptions: {
        outDir: 'dist/esm',
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
    this.removeOldFiles(esmConfig.compilerOptions.outDir);
  }
}

export const buildService = new BuildService();
