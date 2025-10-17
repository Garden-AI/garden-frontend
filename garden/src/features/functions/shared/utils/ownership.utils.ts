import { SUPER_USERS } from "@/utils/utils";

/**
 * Check if the current user is a superuser
 */
export const isSuperUser = (userId?: string): boolean => {
  if (!userId) return false;
  return SUPER_USERS.includes(userId);
};

/**
 * Check if the current user owns a modal function
 */
export const ownsModalFunction = (
  userId?: string,
  ownerId?: string,
  isAuthenticated?: boolean
): boolean => {
  if (!isAuthenticated || !userId) return false;
  return ownerId === userId || isSuperUser(userId);
};

/**
 * Check if the current user can edit an HPC function
 * Currently, only superusers can edit HPC functions
 */
export const canEditHpcFunction = (userId?: string): boolean => {
  return isSuperUser(userId);
};
