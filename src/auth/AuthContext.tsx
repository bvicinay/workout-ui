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
import { registerAuthErrorHandler } from "../api/client";
import { AUTH_ENABLED } from "../config";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  /** Call when an API response returns 401 to re-validate the session. */
  handleAuthError: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!AUTH_ENABLED);
  const [isLoading, setIsLoading] = useState(AUTH_ENABLED);
  const [username, setUsername] = useState<string | null>(
    AUTH_ENABLED ? null : "dev"
  );

  const checkSession = useCallback(() => {
    if (!AUTH_ENABLED) return;

    getSession().then((session) => {
      if (session?.isValid()) {
        setIsAuthenticated(true);
        setUsername(getCurrentUsername());
      } else {
        setIsAuthenticated(false);
        setUsername(null);
      }
      setIsLoading(false);
    });
  }, []);

  // Initial session check on mount.
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Re-validate session when the page is restored from the browser's
  // back-forward cache (bfcache). Without this, going back to the app
  // after a browser-level back-navigation can leave React state stale
  // if the Cognito tokens were refreshed or cleared on the previous page.
  useEffect(() => {
    if (!AUTH_ENABLED) return;

    function onPageShow(e: PageTransitionEvent) {
      // persisted === true means the page was restored from bfcache
      if (e.persisted) {
        checkSession();
      }
    }

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [checkSession]);

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

  // Re-check the session when a 401 is received. If the session is truly
  // gone the user will be redirected to /login by ProtectedRoute.
  const handleAuthError = useCallback(() => {
    if (!AUTH_ENABLED) return;
    getSession().then((session) => {
      if (!session?.isValid()) {
        cognitoSignOut();
        setIsAuthenticated(false);
        setUsername(null);
      }
    });
  }, []);

  // Register the 401 handler with the API client so it can trigger auth
  // re-validation without needing a React context reference in client.ts.
  useEffect(() => {
    registerAuthErrorHandler(handleAuthError);
  }, [handleAuthError]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, username, signIn, signOut, handleAuthError }}
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
