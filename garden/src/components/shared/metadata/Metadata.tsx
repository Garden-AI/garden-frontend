import { Garden, ModalFunction } from "@/types";
import { GardenFunction } from "@/features/functions/shared/types/function.types";
import { ReactNode } from "react";

interface MetadataProps {
  name: string | undefined
  entity: Garden | ModalFunction | GardenFunction;
  ownsThisEntity: boolean;
  children: ReactNode;
}

const Metadata = ({  name, entity, ownsThisEntity, children }: MetadataProps) => {
  return (
    <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">{name + " " || ""}Metadata</h3>
        {children}
      </div>
    </div>
  );
};

export default Metadata; 