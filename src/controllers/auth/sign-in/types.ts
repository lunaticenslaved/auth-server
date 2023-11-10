import { UserDTO } from '#/dto';

export type SignInRequest = {
  login: string;
  password: string;
};

export type SignInResponse = {
  user: UserDTO.User;
};
