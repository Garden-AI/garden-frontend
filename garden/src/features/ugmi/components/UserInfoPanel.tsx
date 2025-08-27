import React from "react";
import { Button } from "@/components/shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn/tooltip";
import { User as UserIcon, LogOut } from "lucide-react";
import { useGlobusAuth } from "@globus/react-auth-context";
import { User } from "@/types";

type UserInfoPanelProps = {
  auth: ReturnType<typeof useGlobusAuth>;
  userInfo: User | undefined;
};

export const UserInfoPanel = ({ auth, userInfo }: UserInfoPanelProps) => {
  if (!auth.isAuthenticated || !userInfo) {
    return (
      <div className="border-b border-slate-300 bg-slate-100 p-3">
        <div className="flex items-center gap-2 text-slate-600">
          <UserIcon className="h-4 w-4" />
          <span className="text-sm">Not logged in</span>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    auth.authorization?.logout();
  };

  return (
    <div className="border-b border-slate-300 bg-slate-100 p-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
          <UserIcon className="h-4 w-4 text-slate-600" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-slate-800">
            {userInfo.name || "User"}
          </div>
          <div className="truncate text-xs text-slate-600">
            {userInfo.email || "No email available"}
          </div>
        </div>
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-slate-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-3 w-3 text-slate-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
