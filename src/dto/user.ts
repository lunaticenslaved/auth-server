type Avatar = {
  id: string;
  link: string;
};

export type User = {
  id: string;
  login: string;
  avatar: Avatar | null;
};
