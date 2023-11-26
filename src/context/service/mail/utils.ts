import nodemailer from 'nodemailer';

import { Constants } from '#/utils';

export const transporter = nodemailer.createTransport({
  host: Constants.MAIL_SMTP_HOST,
  port: Constants.MAIL_SMTP_PORT,
  // not use TLS. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
  secure: false,
  auth: {
    user: Constants.MAIL_SMTP_USER,
    pass: Constants.MAIL_SMTP_PASSWORD,
  },
});
