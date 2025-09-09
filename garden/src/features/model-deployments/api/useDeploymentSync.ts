import { useEffect } from "react";
import { ModelDeployment } from "../ModelDeployments";

/**
 * Custom hook to keep a selected deployment in sync with fresh data from the cache.
 * This ensures that when a deployment's status changes (e.g., from "pending" to "ready"),
 * the callback is triggered with the updated deployment.
 * 
 * @param selectedDeployment - The currently selected deployment
 * @param allDeployments - All deployments from the cache
 * @param onDeploymentUpdate - Callback when the selected deployment has been updated
 */
export function useDeploymentSync(
  selectedDeployment: ModelDeployment | null,
  allDeployments: ModelDeployment[],
  onDeploymentUpdate: (updatedDeployment: ModelDeployment) => void
) {
  useEffect(() => {
    if (!selectedDeployment?.originalData?.id) return;
    
    // Find the updated version from the cache
    const updatedDeployment = allDeployments.find(
      dep => dep.originalData?.id === selectedDeployment.originalData?.id
    );

    // If we found an updated version and it's different, trigger the callback
    if (updatedDeployment && updatedDeployment.status !== selectedDeployment.status) {
      onDeploymentUpdate(updatedDeployment);
    }
  }, [allDeployments, selectedDeployment, onDeploymentUpdate]);
}