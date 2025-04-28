import React from "react";

const VisibilityWarning = () => {

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start items-center">
        <div className="flex-1">
          <h3 className="font-medium text-amber-800">This is Garden is not public</h3>
          <p className="text-amber-700 text-sm mt-1">
            This Garden won&apos;t show up in search results. Register the DOI to make it public.
          </p>
          <p className="text-amber-700 text-sm mt-1">
            Other users can still access it directly if you share the DOI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisibilityWarning; 