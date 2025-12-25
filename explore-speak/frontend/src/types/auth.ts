export interface User {
  userId: string;
  email: string;
  name: string;
  level?: number;
  xp?: number;
  streak?: number;
  createdAt: string;
}

export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface ConfirmEmailData {
  email: string;
  code: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  userId?: string;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; userId: string }>;
  confirmEmail: (email: string, code: string) => Promise<{ success: boolean }>;
  signin: (email: string, password: string) => Promise<{ success: boolean; user: User }>;
  signout: () => void;
  refreshToken: () => Promise<AuthTokens>;
  getAccessToken: () => string | null;
  isAuthenticated: boolean;
}
