import fs from 'fs';
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

  compile() {
    if (fs.existsSync('dist')) {
      console.log('Clear dist folder');
      fs.rmSync('dist', { recursive: true, force: true });
    }

    const cjsConfig = {
      compilerOptions: {
        outDir: 'dist/cjs',
        target: 'es6',
        module: 'commonjs',
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
        suppressImplicitAnyIndexErrors: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        emitDecoratorMetadata: true,
        strictPropertyInitialization: false,
        strict: true,
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
    console.log('Build commonjs');
    this.compileWithConfig(cjsConfig);

    console.log('Build esm module');
    const esmConfig = { ...cjsConfig };
    Object.assign(esmConfig.compilerOptions, {
      outDir: 'dist/esm',
      module: 'esnext',
    });
    this.compileWithConfig(esmConfig);
  }
}

export const buildService = new BuildService();
