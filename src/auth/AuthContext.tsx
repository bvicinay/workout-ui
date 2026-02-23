import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  signIn as cognitoSignIn,
  signOut as cognitoSignOut,
  getSession,
  getCurrentUsername,
} from "./cognito";
import { AUTH_ENABLED } from "../config";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!AUTH_ENABLED);
  const [isLoading, setIsLoading] = useState(AUTH_ENABLED);
  const [username, setUsername] = useState<string | null>(
    AUTH_ENABLED ? null : "dev"
  );

  useEffect(() => {
    if (!AUTH_ENABLED) return;

    getSession().then((session) => {
      if (session?.isValid()) {
        setIsAuthenticated(true);
        setUsername(getCurrentUsername());
      }
      setIsLoading(false);
    });
  }, []);

  const signIn = useCallback(async (user: string, password: string) => {
    await cognitoSignIn(user, password);
    setIsAuthenticated(true);
    setUsername(user);
  }, []);

  const signOut = useCallback(() => {
    cognitoSignOut();
    setIsAuthenticated(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, username, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
