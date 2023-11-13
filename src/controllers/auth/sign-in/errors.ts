import { Error } from '@lunaticenslaved/schema';

export function createUserWithLoginNotExistsError(login: string) {
  return new Error.NotFoundError({
    messages: [`User with the login '${login}' not found`],
    status: 404,
  });
}

export function createInvalidPasswordError() {
  return new Error.ValidationError({
    messages: [`Invalid login or password`],
  });
}
