export type User = {
  _id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse =
  | { user: User; token: string } 
  | { user: User }; 
