export type SafeUser = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email: string;
  role: string;
};

export type AuthActionState = {
  success?: boolean;
  fieldErrors?: Record<string, string[]>;
  generalError?: string;
} | null;

export type SigninActionState = AuthActionState & {
  user?: SafeUser;
};
