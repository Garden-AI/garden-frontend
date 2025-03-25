import React, { useEffect } from 'react';
import { Provider as GlobusAuthorizationManagerProvider, useGlobusAuth } from '@globus/react-auth-context';
import { toast } from 'sonner';

interface GlobusAuthProviderProps {
  client: string;
  redirect: string;
  scopes: string;
  storage: Storage;
  children: React.ReactNode;
  // Optional configuration
  refreshThresholdMinutes?: number;
  checkIntervalMinutes?: number;
}

// Internal component to handle token refresh logic
const TokenRefreshHandler: React.FC<{ 
  children: React.ReactNode;
  refreshThresholdMinutes: number;
  checkIntervalMinutes: number;
}> = ({ children, refreshThresholdMinutes, checkIntervalMinutes }) => {
  const auth = useGlobusAuth();

  useEffect(() => {
    if (!auth.authorization || !auth.isAuthenticated ) return;

    const checkAndRefreshToken = async () => {
      try {
        const tokenData = auth.authorization.getGlobusAuthToken();

        const expiresAt = tokenData.__metadata.expires;
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const refreshThreshold = refreshThresholdMinutes * 60 * 1000;

        if (timeUntilExpiry < refreshThreshold) {
            try {
                await auth.authorization?.refreshTokens();
                console.debug(`Tokens refreshed`);
            } catch (error) {
                console.error(`Could not refresh tokens, logging out`, error);
                // If refresh fails, clear all tokens
                await auth.authorization.revoke();
            }
        }
      } catch (error) {
        // If something really unexpected happens ...
        console.error('Error checking tokens:', error);
        toast.error('We are having trouble refreshing your login session. If you are seeing errors, try logging out and back in');
      }
    };

    // Check token immediately
    checkAndRefreshToken();

    // Set up periodic check
    const intervalId = setInterval(checkAndRefreshToken, checkIntervalMinutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [auth.authorization, refreshThresholdMinutes, checkIntervalMinutes]);

  return <>{children}</>;
};

// Main wrapper component
export const GlobusAuthProvider: React.FC<GlobusAuthProviderProps> = ({
  client,
  redirect,
  scopes,
  storage,
  children,
  refreshThresholdMinutes = 5,
  checkIntervalMinutes = 3,
}) => {
  return (
    <GlobusAuthorizationManagerProvider
      client={client}
      redirect={redirect}
      scopes={scopes}
      storage={storage}
    >
      <TokenRefreshHandler 
        refreshThresholdMinutes={refreshThresholdMinutes}
        checkIntervalMinutes={checkIntervalMinutes}
      >
        {children}
      </TokenRefreshHandler>
    </GlobusAuthorizationManagerProvider>
  );
}; 