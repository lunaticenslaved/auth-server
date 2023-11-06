import { UserDTO } from '@/dto';

export type SignUpRequest = {
  login: string;
  password: string;
};

export type SignUpResponse = {
  user: UserDTO.User;
};
