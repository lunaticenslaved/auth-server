import nodemailer from 'nodemailer';

import { Constants, CryptoUtils } from '#/utils';

const transporter = nodemailer.createTransport({
  host: Constants.MAIL_SMTP_HOST,
  port: Constants.MAIL_SMTP_PORT,
  // not use TLS. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
  secure: false,
  auth: {
    user: Constants.MAIL_SMTP_USER,
    pass: Constants.MAIL_SMTP_PASSWORD,
  },
});

interface SendMailRequest {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface SendUserActivationMailRequest {
  email: string;
  userId: string;
}

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
