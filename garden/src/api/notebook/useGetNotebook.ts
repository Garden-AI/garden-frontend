// import { Notebook } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import axios from "../axios";
interface Cell {
  cell_type: string;
  execution_count: number;
  metadata: any;
  outputs: Array<any>;
  source: Array<any>;
}
interface Notebook {
  cells: Array<Cell>;
}

const getNotebook = async (url: string): Promise<Notebook> => {
  try {
    const response = await axios.get(url, { timeout: 3000 });
    return response.data;
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
