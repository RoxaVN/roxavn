import { Logger, runner } from 'hygen';
import path from 'path';

class TemplateService {
  defaultPath = path.join(__dirname, '../_templates');

  async generate(args: string[]) {
    await runner(args, {
      templates: this.defaultPath,
      cwd: process.cwd(),
      logger: new Logger(console.log.bind(console)),
      exec: (action, body) => {
        const opts = body && body.length > 0 ? { input: body } : {};
        return require('execa').command(action, { ...opts, shell: true });
      },
      createPrompter: () => require('enquirer'),
    });
  }
}

export const templateService = new TemplateService();
