import React, { useEffect } from 'react';
import { Provider as GlobusAuthorizationManagerProvider, useGlobusAuth } from '@globus/react-auth-context';
// import { toast } from 'sonner';
// import { useNavigate } from 'react-router-dom';

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

// interface TokenData {
//   access_token: string;
//   expires_at: number;
//   refresh_token?: string;
// }

// Internal component to handle token refresh logic
const TokenRefreshHandler: React.FC<{ 
  children: React.ReactNode;
  refreshThresholdMinutes: number;
  checkIntervalMinutes: number;
}> = ({ children, refreshThresholdMinutes, checkIntervalMinutes }) => {
  const auth = useGlobusAuth();
//   const navigate = useNavigate();

  useEffect(() => {
    if (!auth.authorization || !auth.isAuthenticated ) return;

    const checkAndRefreshToken = async () => {
      try {
        // Get all tokens from storage
        // const tokens = Object.keys(localStorage)
        //   .filter(key => key.startsWith(`${import.meta.env.VITE_GLOBUS_CLIENT_ID}:`))
        //   .map(key => ({
        //     key,
        //     data: JSON.parse(localStorage.getItem(key) || '{}') as TokenData
        //   }))
        //   .filter(({ data }) => data.expires_at);
        const tokenData = auth.authorization.getGlobusAuthToken();
        // const {data} = token;

        // Check each token
        // // for (const { key, data } of tokens) {
        const expiresAt = tokenData.__metadata.expires; // Convert to milliseconds
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;
        const refreshThreshold = refreshThresholdMinutes * 60 * 1000;

        console.log(tokenData.expires_in)
        console.log(timeUntilExpiry);
        console.log(timeUntilExpiry/(1000 * 60 * 60))
        if (timeUntilExpiry < refreshThreshold) {
            try {
                await auth.authorization?.refreshTokens();
                console.debug(`Tokens refreshed`);
            } catch (error) {
                console.error(`Could not refresh tokens, logging out`, error);
                // If refresh fails, clear all tokens
                await auth.authorization.revoke();
                // Should I direct user to log in? Probably not

                // Object.keys(localStorage)
                // .filter(k => k.startsWith(`${import.meta.env.VITE_GLOBUS_CLIENT_ID}:`))
                // .forEach(k => localStorage.removeItem(k));
                // toast.error('Your session has expired. Please log in again.');
                // navigate('/login');
            }
        }
        // }
      } catch (error) {
        // Not clear I should do sth here ...
        console.error('Error checking tokens:', error);
        // toast.error('There was an error checking your session. Please try logging in again.');
        // navigate('/login');
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
  refreshThresholdMinutes = 2820, // 5, // Default to 5 minutes
  checkIntervalMinutes = 4, // Default to 4 minutes
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