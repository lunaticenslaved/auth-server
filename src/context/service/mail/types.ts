export interface IMailService {
  sendUserActivationMail(data: SendUserActivationMailRequest): void;
  getUserIdFromActivationToken(activationToken: string): string;
}

export interface SendMailRequest {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface SendUserActivationMailRequest {
  email: string;
  userId: string;
}
