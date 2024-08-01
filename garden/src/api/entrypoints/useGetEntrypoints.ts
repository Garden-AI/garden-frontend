import { useQuery } from "@tanstack/react-query";
import axios from "../axios";
import { Entrypoint } from "../types";

interface UseGetEntrypointsProps {
  userId?: string;
  gardenId?: string;
}
let callCount = 0;
const initialEntrypoints = [
  {
    doi: "10.26311/3p8f-se33",
    title: "Bandgap model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
  {
    doi: "10.26311/mk1a-ve41",
    title:
      "Lithium solid state electrolyte conductivity model. Lithium solid state electrolyte conductivity model",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
];

const additionalEntrypoints = [
  {
    doi: "10.26311/17nn-hj98",
    title: "Metallic glass Rc model (LLM data)",
    description:
      "Garden containing random forest models of 33 materials properties to provide predictions, error bars, and domain of applicability guidance",
  },
];

const getEntrypoints = async ({
  userId,
  gardenId,
}: UseGetEntrypointsProps): Promise<any[]> => {
  // console.log("userId", userId);
  // console.log("gardenId", gardenId);

  return new Promise((resolve) => {
    setTimeout(() => {
      if (callCount === 0) {
        callCount++;
        resolve(initialEntrypoints);
      } else {
        const newEntrypoint = additionalEntrypoints[callCount - 1];
        if (newEntrypoint) {
          callCount++;
          resolve([...initialEntrypoints, newEntrypoint] as any);
        } else {
          resolve([...initialEntrypoints, ...additionalEntrypoints] as any);
        }
      }
    }, 500);
  });
};

export const useGetEntrypoints = ({
  userId,
  gardenId,
}: UseGetEntrypointsProps) => {
  return useQuery<Entrypoint[], Error>({
    queryKey: ["entrypoints", userId],
    queryFn: () => getEntrypoints({ userId, gardenId }),
  });
};