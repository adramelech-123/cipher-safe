
export interface UserType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string
}

export interface StoreState {
  user: UserType | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;

  signup: (email: string, password: string, username: string, confirmPassword: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}
