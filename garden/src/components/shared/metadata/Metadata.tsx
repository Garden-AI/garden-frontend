import { Garden, ModalFunction } from "@/types";
import { ReactNode } from "react";

interface MetadataProps {
  entity: Garden | ModalFunction;
  ownsThisEntity: boolean;
  children: ReactNode;
}

const Metadata = ({ entity, ownsThisEntity, children }: MetadataProps) => {
  return (
    <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2">Metadata</h3>
        {children}
      </div>
    </div>
  );
};

export default Metadata; 