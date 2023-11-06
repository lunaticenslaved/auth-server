export const APP_ENV = process.env.APP_ENV;
export const IS_DEV = APP_ENV === 'dev';

export const PORT = Number(process.env.PORT) || 3000;
export const CORS_ORIGIN_WHITELIST = JSON.parse(process.env.CORS_ORIGIN_WHITELIST || '[]');

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;

export const OBJECT_STORAGE_REGION = process.env.OBJECT_STORAGE_REGION;
export const OBJECT_STORAGE_AVATARS_NAME = process.env.OBJECT_STORAGE_AVATARS_NAME;
export const OBJECT_STORAGE_AVATARS_SECRET = process.env.OBJECT_STORAGE_AVATARS_SECRET;
export const OBJECT_STORAGE_AVATARS_KEY_ID = process.env.OBJECT_STORAGE_AVATARS_KEY_ID;
