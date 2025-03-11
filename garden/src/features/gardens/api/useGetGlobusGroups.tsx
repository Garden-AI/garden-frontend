import { useQuery } from "@tanstack/react-query";

import { groups } from "@globus/sdk";

const getGlobusGroups = async () => {
  try {
    const localStorageAccessToken = localStorage.getItem(
      `${import.meta.env.VITE_GLOBUS_CLIENT_ID}:groups.api.globus.org`,
    );
    if (!localStorageAccessToken) {
      throw new Error("No access token found");
    }
    const accessToken = JSON.parse(localStorageAccessToken).access_token;

    const response = await groups.groups.getMyGroups({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.json();
  } catch (error) {
    throw new Error("Error greeting user");
  }
};

export const useGetGlobusGroups = () => {
  return useQuery({
    queryKey: ["greet"],
    queryFn: getGlobusGroups,
  });
};
