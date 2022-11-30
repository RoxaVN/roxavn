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
      process.exit(1);
    }
    return configParseResult;
  }

  compile() {
    const rawConfig = {
      compilerOptions: {
        outDir: 'dist',
        target: 'es5',
        module: 'commonjs',
        lib: ['dom', 'dom.iterable', 'esnext'],
        jsx: 'react-jsx',
        declaration: true,
        moduleResolution: 'node16',
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
        strict: true,
      },
      include: ['src'],
      exclude: ['node_modules', 'dist'],
    };
    if (fs.existsSync(rawConfig.compilerOptions.outDir)) {
      fs.rmSync(rawConfig.compilerOptions.outDir, {
        recursive: true,
        force: true,
      });
    }
    const config = this.parseConfig(rawConfig);

    // Compile
    const program = ts.createProgram(config.fileNames, config.options);
    const emitResult = program.emit();

    // Report errors
    this.reportDiagnostics(
      ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
    );

    // Return code
    const exitCode = emitResult.emitSkipped ? 1 : 0;
    process.exit(exitCode);
  }
}

export const buildService = new BuildService();
