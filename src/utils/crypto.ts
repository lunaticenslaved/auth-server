import crypto from 'crypto';

import { Constants } from '#/utils';

const algorithm = 'aes-256-ctr';
const key = crypto.scryptSync(
  Constants.RANDOM_TOKEN_SECRET_KEY || 'secret',
  Constants.RANDOM_TOKEN_SALT || 'salt',
  32,
);
const iv = Buffer.alloc(16, 0);

export function encrypt(data: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = cipher.update(data, 'utf8', 'hex');

  return encrypted + cipher.final('hex');
}

export function decrypt(hash: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(hash, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
