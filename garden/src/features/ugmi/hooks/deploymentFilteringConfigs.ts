import { UseDeploymentFilteringOptions } from "./useDeploymentFiltering";

export const functionLibraryFilteringOptions: UseDeploymentFilteringOptions = {
  sortOptions: [
    {
      label: "Name (A-Z)",
      value: "name",
      sortFn: (a, b) => a.name.localeCompare(b.name)
    },
    {
      label: "Name (Z-A)", 
      value: "name-desc",
      sortFn: (a, b) => b.name.localeCompare(a.name)
    },
    {
      label: "Status (Deployed First)",
      value: "status-deployed",
      sortFn: (a, b) => {
        const statusOrder = { deployed: 0, undeployed: 1, error: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
    }
  ],
  filterConfigs: [
    {
      label: "Deployed",
      key: "deployed",
      defaultChecked: true,
      filterFn: (deployment) => deployment.status === "deployed"
    },
    {
      label: "In-Progress", 
      key: "undeployed",
      defaultChecked: true,
      filterFn: (deployment) => deployment.status === "undeployed"
    },
    {
      label: "Error",
      key: "error", 
      defaultChecked: true,
      filterFn: (deployment) => deployment.status === "error"
    }
  ],
  searchFields: ['name', (deployment) => {
    // Search in function names, titles, and descriptions
    const functions = deployment.originalData?.modal_functions || [];
    return functions.map(fn => 
      [fn.function_name, fn.title, fn.description].filter(Boolean).join(' ')
    ).join(' ');
  }],
  defaultSort: "name"
};