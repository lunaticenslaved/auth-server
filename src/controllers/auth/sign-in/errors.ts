import { AuthenticationError } from '@/errors';

export function createUserWithLoginNotExistsError(login: string) {
  return new AuthenticationError({ errors: [`User with the login '${login}' not found`] });
}

export function createInvalidPasswordError() {
  return new AuthenticationError({ errors: [`Invalid login or password`] });
}
