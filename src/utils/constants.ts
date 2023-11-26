export const APP_ENV = process.env.APP_ENV;
export const IS_DEV = APP_ENV === 'dev';

export const PORT = Number(process.env.PORT) || 3000;
export const CORS_ORIGIN_WHITELIST = JSON.parse(process.env.CORS_ORIGIN_WHITELIST || '[]');

export const CLIENT_URL = process.env.CLIENT_URL;
export const CLIENT_ACTIVATION_URI = process.env.CLIENT_ACTIVATION_URI;

export const RANDOM_TOKEN_SECRET_KEY = process.env.RANDOM_TOKEN_SECRET_KEY;
export const RANDOM_TOKEN_SALT = process.env.RANDOM_TOKEN_SALT;

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
export const CORS_WHITELIST = JSON.parse(process.env.CORS_WHITELIST);

export const OBJECT_STORAGE_REGION = process.env.OBJECT_STORAGE_REGION;
export const OBJECT_STORAGE_AVATARS_NAME = process.env.OBJECT_STORAGE_AVATARS_NAME;
export const OBJECT_STORAGE_AVATARS_SECRET = process.env.OBJECT_STORAGE_AVATARS_SECRET;
export const OBJECT_STORAGE_AVATARS_KEY_ID = process.env.OBJECT_STORAGE_AVATARS_KEY_ID;

export const MAIL_SMTP_HOST = process.env.MAIL_SMTP_HOST;
export const MAIL_SMTP_PORT = Number(process.env.MAIL_SMTP_PORT);
export const MAIL_SMTP_PASSWORD = process.env.MAIL_SMTP_PASSWORD;
export const MAIL_SMTP_USER = process.env.MAIL_SMTP_USER;
