import { Garden } from "@/types";
import { usePatchGarden } from "../../api/usePatchGarden";
import { useGlobusAuth } from "@globus/react-auth-context";
import { EditableMetadataField } from "@/components/shared/metadata";

interface GardenDescriptionProps {
  garden: Garden;
  ownsThisGarden: boolean,
}

const GardenDescription = ({ garden, ownsThisGarden }: GardenDescriptionProps) => {
  const { mutateAsync: updateGarden } = usePatchGarden();

  return (
    <div className="space-y-3 py-2">
      <EditableMetadataField
        label="Description"
        value={garden.description || ""}
        fieldName="description"
        entity={garden}
        ownsThisEntity={ownsThisGarden}
        onUpdate={async (updateData) => {
          await updateGarden({
            doi: garden.doi,
            garden: updateData
          });
        }}
        placeholder="Tell us about your garden"
      />
    </div>
  );
};

export default GardenDescription; 