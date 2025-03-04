import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InfoIcon, XIcon } from "lucide-react";
import { Garden } from "@/types";

const MetadataWarning = ({ garden }: { garden: Garden }) => {
  const [isDismissed, setIsDismissed] = React.useState(() => {
    const stored = localStorage.getItem(`metadata-warning-dismissed-${garden.doi}`);
    return stored === "true";
  });

  // Get all datasets linked to this garden
  const datasets = garden.entrypoints
    ?.map((entrypoint) => entrypoint.datasets || [])
    .flat()
    .filter((dataset, index, self) => {
      return index === self.findIndex((t) => t.doi === dataset.doi);
    }) || [];
  
  // Get all papers linked to this garden
  const papers = garden.entrypoints
    ?.map((entrypoint) => entrypoint.papers || [])
    .flat()
    .filter((paper, index, self) => {
      return index === self.findIndex((t) => t.doi === paper.doi);
    }) || [];

  // Check for missing important metadata or connections
  const missingBasicMetadata = !garden.tags?.length || !garden.year || !garden.version;
  const hasNoDatasets = datasets.length === 0;
  const hasNoPapers = papers.length === 0;
  
  // Show warning if basic metadata is missing OR if both datasets and papers are missing
  const hasMissingMetadata = missingBasicMetadata || (hasNoDatasets && hasNoPapers);
  
  if (isDismissed || !hasMissingMetadata) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem(`metadata-warning-dismissed-${garden.doi}`, "true");
    setIsDismissed(true);
  };

  return (
    <div className="mt-2 rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <InfoIcon className="mt-1 h-5 w-5 text-amber-600 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900">This Garden is Missing Important Metadata</h3>
            <p className="mt-1 text-sm text-amber-700">
              Linking your Garden to related datasets and papers significantly enhances its value and usefulness. 
              Additional metadata like tags and other details will also make it easier for others to discover your work.
              Please consider adding these connections before making this Garden public.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
              asChild
            >
              <Link to={`/garden/${encodeURIComponent(garden.doi)}/edit`}>
                Add Metadata
              </Link>
            </Button>
          </div>
        </div>
        <button 
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800"
          aria-label="Dismiss warning"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MetadataWarning; 