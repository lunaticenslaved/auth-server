import { Express } from 'express';

import bcrypt from 'bcrypt';

export const createRoutes = (fn: (app: Express) => void) => (app: Express) => {
  fn(app);
};

export const createHash = async (str: string) => {
  return bcrypt.hash(str, 10);
};
