import React, { useState } from "react";
import { Loader2, Bookmark } from "lucide-react";
import { useSaveGarden, useUnsaveGarden, useGetUserInfo } from "@/api"; // Assuming these hooks exist
import { Garden } from "@/api/types";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function SaveGardenButton({ garden }: { garden: Garden }) {
  const [hover, setHover] = useState(false);
  const { mutate: saveGarden, isPending: saveGardenIsPending } = useSaveGarden(garden.doi);
  const { mutate: unsaveGarden, isPending: unsaveGardenIsPending } = useUnsaveGarden(garden.doi);
  const { data: user } = useGetUserInfo();

  const isSaved = user?.saved_garden_dois?.includes(garden.doi);

  if (!user) {
    return null;
  }

  const handleClick = () => {
    if (isSaved) {
      unsaveGarden();
    } else {
      saveGarden();
    }
  };

  const getIconColor = () => {
    if (isSaved) {
      return hover ? "text-red-500" : "text-primary";
    }
    return hover ? "text-primary" : "text-gray-800";
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="px-1"
        >
          <div
            onClick={handleClick}
            className={cn(
              "relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors duration-200 ease-in-out",
              hover ? (isSaved ? "bg-red-100" : "bg-primary/40") : "bg-transparent",
            )}
          >
            {unsaveGardenIsPending || saveGardenIsPending ? (
              <Loader2 className="animate-spin text-blue-700" />
            ) : (
              <Bookmark
                className={cn(" h-6 w-6 transition-all duration-200 ease-in-out", getIconColor())}
                fill={isSaved ? "currentColor" : "none"}
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {user?.saved_garden_dois?.includes(garden.doi)
            ? "Remove from saved gardens"
            : "Add to saved gardens"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
