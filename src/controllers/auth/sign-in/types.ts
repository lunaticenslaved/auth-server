import { User } from '@/models/user';

export type SignInRequest = {
  login: string;
  password: string;
};

export type SignInResponse = {
  user: User;
};
