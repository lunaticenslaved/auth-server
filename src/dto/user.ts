type Avatar = {
  id: string;
  link: string;
};

export type User = {
  id: string;
  login: string;
  email: string;
  avatar: Avatar | null;
};
