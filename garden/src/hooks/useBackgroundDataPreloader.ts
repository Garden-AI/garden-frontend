import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGlobusAuth } from '@globus/react-auth-context';
import { useGetUserInfo } from '@/features/users/api/useGetUserInfo';
import { AxiosError } from 'axios';
import instance from '@/lib/axios'; // Use the configured instance

/**
 * Background preloader that warms up the cache with frequently used data
 * Runs after authentication and initial page load to avoid blocking the UI
 */
export const useBackgroundDataPreloader = (enabled = true) => {
  const auth = useGlobusAuth();
  const queryClient = useQueryClient();
  const { data: userInfo } = useGetUserInfo();

  useEffect(() => {
    // Only run if enabled, authenticated, and have user info
    if (!enabled || !auth.isAuthenticated || !userInfo?.identity_id) {
      return;
    }

    // Delay preloading to avoid interfering with initial page load
    const preloadTimer = setTimeout(() => {
      preloadData();
    }, 2000); // 2 second delay after auth + user info

    return () => clearTimeout(preloadTimer);
  }, [enabled, auth.isAuthenticated, userInfo?.identity_id, queryClient]);

  const preloadData = async () => {
    console.debug('🚀 Starting background data preloading...');
    
    try {
      // Stage 1: User's gardens (high priority) 
      if (userInfo?.identity_id) {
        await queryClient.prefetchQuery({
          queryKey: ['gardens', { owner_uuid: userInfo.identity_id }], // Matches useGetGardens key
          queryFn: async () => {
            const response = await instance.get('/gardens', {
              params: { owner_uuid: userInfo.identity_id }
            });
            return response.data;
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
        console.debug('✅ Preloaded user gardens');
      }

      // Stage 2: Model deployments (medium priority)
      await queryClient.prefetchQuery({
        queryKey: ['modelDeployments'],
        queryFn: async () => {
          const response = await instance.get('/modal-apps/');
          const data = response.data;
          return data.map((ma: any) => ({
            id: ma.id ?? -1,
            name: ma.original_app_name || ma.app_name,
            status: ma.deploy_status === "done" ? "deployed" :
              ma.deploy_status === "error" ? "error" :
                ma.deploy_status === "timed_out" ? "error" : "undeployed",
            type: "Modal App",
            originalData: ma,
          }));
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
      console.debug('✅ Preloaded model deployments');

      // Stage 3: Saved gardens (if user has any saved DOIs)
      const savedGardenDois = userInfo?.saved_garden_dois || [];
      if (savedGardenDois.length > 0) {
        await queryClient.prefetchQuery({
          queryKey: ['savedGardens', savedGardenDois.sort().join(',')],
          queryFn: async () => {
            const searchRequest = {
              q: "",
              limit: 100,
              offset: 0,
              filters: [{
                field_name: "doi",
                values: savedGardenDois,
                operation: "OR" as const,
              }]
            };
            const response = await instance.post('/gardens/search', searchRequest);
            return response.data;
          },
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
        console.debug('✅ Preloaded saved gardens');
      }

      // Stage 4: Published gardens (lower priority, smaller batch)
      setTimeout(async () => {
        await queryClient.prefetchQuery({
          queryKey: ['gardens', { draft: false, limit: 50 }], // Smaller initial batch
          queryFn: async () => {
            const response = await instance.get('/gardens', {
              params: { draft: false, limit: 50 }
            });
            return response.data;
          },
          staleTime: 10 * 60 * 1000, // 10 minutes (longer for discovery data)
        });
        console.debug('✅ Preloaded published gardens (initial batch)');
      }, 3000); // Additional delay for lowest priority data

      console.debug('🎉 Background preloading completed');
    } catch (error) {
      console.debug('⚠️ Background preloading failed:', error);
      
      // If we get auth errors, don't retry - user might have logged out
      if (error instanceof AxiosError && error.response?.status === 401) {
        console.debug('Authentication error during preloading - user may have logged out');
        return;
      }
      
      // For other errors, fail silently - preloading is optional
    }
  };
};