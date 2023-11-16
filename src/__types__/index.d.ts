import 'express';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: 'dev' | 'prod';
      PORT?: string;

      DATABASE_URL: string;

      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      ACCESS_TOKEN_EXPIRES_IN: string;
      REFRESH_TOKEN_EXPIRES_IN: string;

      OBJECT_STORAGE_REGION: string;
      OBJECT_STORAGE_AVATARS_NAME: string;
      OBJECT_STORAGE_AVATARS_KEY_ID: string;
      OBJECT_STORAGE_AVATARS_SECRET: string;
    }
  }
}

declare module 'express' {
  export interface Request {
    userId?: string;
    sessionId?: string;
  }
}
