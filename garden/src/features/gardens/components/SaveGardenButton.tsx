import { useState } from "react";
import { Loader2, Bookmark } from "lucide-react";
import { Garden } from "@/types";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/shadcn/tooltip";
import { Button } from "@/components/shadcn/button";
import { cn } from "@/utils/form.utils";
import { useGetUserInfo } from "@/features/users/api/useGetUserInfo";
import { useSaveGarden } from "../api/useSaveGarden";
import { useUnsaveGarden } from "../api/useUnsaveGarden";

const SaveGardenButton = ({ garden }: { garden: Garden }) => {
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
          <Button
            onClick={handleClick}
            size={"icon"}
            variant={"ghost"}
            className={cn(
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
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {user?.saved_garden_dois?.includes(garden.doi)
            ? "Remove from saved gardens"
            : "Add to saved gardens"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SaveGardenButton;
