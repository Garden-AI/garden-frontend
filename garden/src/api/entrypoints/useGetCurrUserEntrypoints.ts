import { Garden } from "@/api/types";
import axios from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

const getCurrUserEntrypoints = async (user_id: string): Promise<Garden> => {
    try {
        const response = await axios.get('/entrypoints', {
            params: {
                owner_uuid: user_id,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Error fetching current user's entrypoints");
    }
};

export const useGetCurrUserEntrypoints = (user_id: string) => {
  return useQuery<Garden, Error>({
    queryKey: ["garden", user_id],
    queryFn: () => getCurrUserEntrypoints(user_id),
  });
};
