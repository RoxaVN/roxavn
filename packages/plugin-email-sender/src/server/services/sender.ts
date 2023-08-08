import { BaseService, type ServiceFactory } from '@roxavn/core/server';
import {
  GetSettingService,
  serverModule as utilsServerModule,
} from '@roxavn/module-utils/server';
import { createTransport, Transporter } from 'nodemailer';

import { serverModule } from '../module.js';
import { constants, settingApi } from '../../base/index.js';

export class SendEmailService implements BaseService {
  transporter: Transporter;

  constructor(transportOptions: any, private sender: string) {
    this.transporter = createTransport(transportOptions);
  }

  async handle(request: {
    to: string | string[];
    subject: string;
    content: string;
  }) {
    const info = await this.transporter.sendMail({
      from: this.sender,
      to: request.to,
      subject: request.subject,
      text: request.content,
      html: request.content,
    });
    return { id: info.messageId };
  }

  @serverModule.bindFactory({ api: settingApi.updateEmailSenderSetting })
  static create: ServiceFactory = async (context) => {
    const service = await context.container.getAsync(GetSettingService);
    const config = await service.handle({
      module: utilsServerModule.name,
      name: constants.EMAIL_SENDER_SETTING,
    });
    return new SendEmailService(config.transportOptions, config.sender);
  };
}
