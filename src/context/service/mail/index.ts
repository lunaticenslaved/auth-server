import { Constants, CryptoUtils } from '#/utils';

import { SendMailRequest, SendUserActivationMailRequest } from './types';
import { transporter } from './utils';

export interface IMailService {
  sendUserActivationMail(data: SendUserActivationMailRequest): void;
  getUserIdFromActivationToken(activationToken: string): string;
}

export class MailService implements IMailService {
  private async sendMail(request: SendMailRequest) {
    transporter.sendMail({
      ...request,
      from: Constants.MAIL_SMTP_USER,
    });
  }

  public getUserIdFromActivationToken(activationToken: string) {
    return CryptoUtils.decrypt(decodeURIComponent(activationToken));
  }

  async sendUserActivationMail(data: SendUserActivationMailRequest) {
    const { email, userId } = data;
    const activationToken = encodeURIComponent(CryptoUtils.encrypt(userId));
    const link = `${Constants.CLIENT_URL}/${Constants.CLIENT_ACTIVATION_URI}/${activationToken}`
      .replaceAll('///', '/')
      .replaceAll('//', '/');

    await this.sendMail({
      to: email,
      subject: 'Активация аккаунта на ' + Constants.CLIENT_URL,
      text: '',
      html: `
            <div>
              <h1>Для активации перейдите по ссылке</h2>
              <a href="${link}">${link}</a>
            </div>
          `,
    });
  }
}
