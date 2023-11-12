import { Error } from '@lunaticenslaved/schema';

export function createUserWithLoginNotExistsError(login: string) {
  return new Error.AuthenticationError({
    messages: [`User with the login '${login}' not found`],
  });
}

export function createInvalidPasswordError() {
  return new Error.AuthenticationError({
    messages: [`Invalid login or password`],
  });
}
