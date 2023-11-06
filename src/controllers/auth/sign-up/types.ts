import { User } from '@/models/user';

export type SignUpRequest = {
  login: string;
  password: string;
};

export type SignUpResponse = {
  user: User;
};
