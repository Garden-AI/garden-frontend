// import { Notebook } from "@/api/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

interface GetNotebookProps {
  url: string;
}

const getNotebook = async ({ url }: GetNotebookProps): Promise<Notebook> => {
  try {
    const response = await axios.get<Notebook>(url, { timeout: 1500 });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const useGetNotebook = (url: string) => {
  return useQuery<Notebook, Error>({
    queryKey: ["notebook", url],
    queryFn: () => getNotebook({ url }),
  });
};
