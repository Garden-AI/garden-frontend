import React from "react";
import { Button } from "@/components/shadcn/button";

const VisibilityWarning = ({ garden, isPublishGardenModalOpen, setIsPublishGardenModalOpen }: {
  garden: any,
  isPublishGardenModalOpen: boolean,
  setIsPublishGardenModalOpen: (open: boolean) => void
}) => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start items-center">
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">This is a draft Garden.</h3>
          <p className="text-amber-700 text-sm mt-1">
            This Garden won&apos;t show up in search results. It will be auto-deleted after two weeks if it is not published.
          </p>
          <p className="text-amber-700 text-sm mt-1">
            Publish this Garden to make it findable in search results.
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <Button
            variant="default"
            onClick={() => setIsPublishGardenModalOpen(true)}
            disabled={isPublishGardenModalOpen}
          >
            Publish Garden
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VisibilityWarning; 