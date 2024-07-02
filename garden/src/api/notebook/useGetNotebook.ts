import { Notebook } from "@/types";
import { useQuery } from "@tanstack/react-query";

const getNotebook = async (url: string): Promise<Notebook> => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching notebook", error);
    throw error;
  }
};

export const useGetNotebook = (url: string) => {
  return useQuery<Notebook, Error>({
    queryKey: ["notebook", url.split("/").pop()],
    queryFn: () => getNotebook(url),
  });
};
