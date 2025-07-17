interface AuthSession {
  isAuthenticated: boolean;
  loginTime: number;
  expiresAt: number;
}

const AUTH_STORAGE_KEY = 'assetwise_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const authService = {
  // Store authentication session
  setSession: (isAuthenticated: boolean): void => {
    const now = Date.now();
    const session: AuthSession = {
      isAuthenticated,
      loginTime: now,
      expiresAt: now + SESSION_DURATION
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  },

  // Get current session if valid
  getSession: (): AuthSession | null => {
    try {
      const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedSession) return null;

      const session: AuthSession = JSON.parse(storedSession);
      const now = Date.now();

      // Check if session is expired
      if (now > session.expiresAt) {
        authService.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading auth session:', error);
      authService.clearSession();
      return null;
    }
  },

  // Check if user is currently authenticated
  isAuthenticated: (): boolean => {
    const session = authService.getSession();
    return session?.isAuthenticated || false;
  },

  // Clear the authentication session
  clearSession: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  // Get remaining session time in minutes
  getRemainingTime: (): number => {
    const session = authService.getSession();
    if (!session) return 0;

    const now = Date.now();
    const remaining = session.expiresAt - now;
    return Math.max(0, Math.floor(remaining / (60 * 1000))); // Convert to minutes
  },

  // Extend the current session by 1 hour
  extendSession: (): boolean => {
    const session = authService.getSession();
    if (!session) return false;

    const now = Date.now();
    const updatedSession: AuthSession = {
      ...session,
      expiresAt: now + SESSION_DURATION
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedSession));
    return true;
  }
}; 