// import { Notebook } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

const getNotebook = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching notebook", error);
    throw error;
  }
};

export const useGetNotebook = (url: string) => {
  return useQuery<any, Error>({
    queryKey: ["notebook", url.split("/").pop()],
    queryFn: () => getNotebook(url),
  });
};
