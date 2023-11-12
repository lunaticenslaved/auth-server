import { Error } from '@lunaticenslaved/schema';

export function createUserWithLoginExistsError(login: string) {
  return new Error.ConflictError({ messages: [`User with the login '${login}' already exists`] });
}
