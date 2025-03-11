import React from 'react';
import { InfoIcon } from 'lucide-react';

interface ReviewNoticeProps {
  isNewlyCreated: boolean;
  ownsThisGarden: boolean;
}

const ReviewNotice = ({ isNewlyCreated, ownsThisGarden }: ReviewNoticeProps) => {
  if (!isNewlyCreated || !ownsThisGarden) {
    return null;
  }

  return (
    <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800 border border-amber-200 mb-4">
      <div className="flex items-start gap-2">
        <InfoIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium">We've pre-populated your garden's metadata</p>
          <p className="mt-1">Please review and edit the information to ensure it's accurate and complete.</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewNotice; 