import { ConflictError } from '@/errors';

export function createUserWithLoginExistsError(login: string) {
  return new ConflictError({ errors: [`User with the login '${login}' already exists`] });
}
