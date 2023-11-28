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

  getUserIdFromActivationToken(activationToken: string) {
    return CryptoUtils.decrypt(activationToken);
  }

  async sendUserActivationMail(data: SendUserActivationMailRequest) {
    const { email, userId } = data;
    const activationToken = CryptoUtils.encrypt(userId);

    await this.sendMail({
      to: email,
      subject: 'Активация аккаунта',
      text: '',
      html: `
            <div>
              <h1>Введите код для активации</h2>
              <p>${activationToken}</p>
            </div>
          `,
    });
  }
}
