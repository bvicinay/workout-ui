import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID, AUTH_ENABLED } from "../config";

let userPool: CognitoUserPool | null = null;

function getUserPool(): CognitoUserPool {
  if (!userPool) {
    userPool = new CognitoUserPool({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
  }
  return userPool;
}

export function signIn(
  username: string,
  password: string
): Promise<CognitoUserSession> {
  return new Promise((resolve, reject) => {
    if (!AUTH_ENABLED) {
      reject(new Error("Auth is not configured"));
      return;
    }

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: getUserPool(),
    });

    cognitoUser.setAuthenticationFlowType("USER_PASSWORD_AUTH");

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => resolve(session),
      onFailure: (err) => reject(err),
      newPasswordRequired: () => {
        reject(new Error("New password required. Please contact your administrator."));
      },
    });
  });
}

export function signOut(): void {
  if (!AUTH_ENABLED) return;
  const user = getUserPool().getCurrentUser();
  if (user) {
    user.signOut();
  }
}

export function getSession(): Promise<CognitoUserSession | null> {
  return new Promise((resolve) => {
    if (!AUTH_ENABLED) {
      resolve(null);
      return;
    }

    const user = getUserPool().getCurrentUser();
    if (!user) {
      resolve(null);
      return;
    }

    user.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session?.isValid()) {
        resolve(null);
      } else {
        resolve(session);
      }
    });
  });
}

export async function getCurrentToken(): Promise<string | null> {
  const session = await getSession();
  return session?.getAccessToken().getJwtToken() ?? null;
}

export function getCurrentUsername(): string | null {
  if (!AUTH_ENABLED) return "dev";
  const user = getUserPool().getCurrentUser();
  return user?.getUsername() ?? null;
}
