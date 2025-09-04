import React, { ReactNode, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/shadcn/button";
import WithTooltip from "@/components/WithTooltip";

export interface PanelHeaderProps {
  // Basic display
  icon: ReactNode;
  title: string;
  count?: number;
  onDoubleClick?: () => void;

  // Theme colors
  themeColors: {
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  };

  // Actions - just render what's passed in
  actions?: ReactNode;

  // Search functionality  
  searchComponent?: ReactNode;
  showSearchToggle?: boolean;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  icon,
  title,
  count,
  onDoubleClick,
  themeColors,
  actions,
  searchComponent,
  showSearchToggle = false,
}) => {
  const [searchExpanded, setSearchExpanded] = useState(false);
  return (
    <div
      className={`rounded-lg border-b-2 ${themeColors.border} ${themeColors.bg}`}
      onDoubleClick={onDoubleClick}
    >
      <div className="px-4 py-3 flex flex-col gap-3">
        {/* Main header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={themeColors.iconColor}>
              {icon}
            </div>
            <h2 className={`text-sm font-semibold ${themeColors.text}`}>
              {title}{count !== undefined ? ` (${count})` : ''}
            </h2>
          </div>

          {/* Actions (buttons, dropdowns, etc.) */}
          <div className="flex items-center gap-1">
            {/* Search toggle button */}
            {showSearchToggle && searchComponent && (
              <WithTooltip hint={searchExpanded ? "Hide search" : "Show search"}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setSearchExpanded(!searchExpanded)}
                >
                  <Search className={`h-4 w-4 ${searchExpanded ? 'text-blue-600' : ''}`} />
                </Button>
              </WithTooltip>
            )}
            {actions}
          </div>
        </div>

        {/* Search row - conditionally rendered */}
        {searchComponent && searchExpanded && (
          <div>
            {searchComponent}
          </div>
        )}
      </div>
    </div>
  );
};