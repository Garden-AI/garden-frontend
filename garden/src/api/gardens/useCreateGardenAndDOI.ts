import { useCreateDOI } from "../doi/useCreateDOI";
import { useUpdateDOI } from "../doi/useUpdateDOI";
import { GardenCreateRequest } from "../types";
import { useCreateGarden } from "./useCreateGarden";

export const useCreateGardenAndDOI = () => {
  const { mutateAsync: createDOI } = useCreateDOI();
  const { mutateAsync: createGarden } = useCreateGarden();
  const { mutateAsync: updateDOI } = useUpdateDOI();

  const createGardenAndDOI = async (values: Omit<GardenCreateRequest, "doi">) => {
    const { doi } = await createDOI();
    const { data: garden } = await createGarden({ ...values, doi });
    await updateDOI({
      resource: garden,
    });
    return { garden };
  };

  return { createGardenAndDOI };
};
