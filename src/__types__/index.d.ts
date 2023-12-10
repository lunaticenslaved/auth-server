import 'express';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: 'dev' | 'production';
      PORT?: string;

      DATABASE_URL: string;

      DOMAIN: string;

      RANDOM_TOKEN_SECRET_KEY: string;
      RANDOM_TOKEN_SALT: string;

      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;

      OBJECT_STORAGE_REGION: string;
      OBJECT_STORAGE_AVATARS_NAME: string;
      OBJECT_STORAGE_AVATARS_KEY_ID: string;
      OBJECT_STORAGE_AVATARS_SECRET: string;

      MAIL_SMTP_HOST: string;
      MAIL_SMTP_PORT: string;
      MAIL_SMTP_USER: string;
      MAIL_SMTP_PASSWORD: string;
    }
  }

  declare namespace Express {
    export interface Request {
      userId?: string;
    }
  }
}
