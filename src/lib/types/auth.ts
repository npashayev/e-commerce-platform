export type SafeUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: string;
};

export type AuthActionState = {
  success?: boolean;
  fieldErrors?: Record<string, string[]>;
  generalError?: string;
} | null;

