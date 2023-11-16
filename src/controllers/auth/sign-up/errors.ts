import { Errors } from '@lunaticenslaved/schema';

export function createUserWithLoginExistsError(login: string) {
  return new Errors.ConflictError({
    messages: [`User with the login '${login}' already exists`],
    status: 403,
  });
}
