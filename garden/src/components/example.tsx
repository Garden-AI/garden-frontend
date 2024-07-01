import React, { useEffect } from "react";
import { useSearchGardenByDOI, useSearchGardens } from "../api/search";

const SampleGardenComponent = ({ doi }: { doi: string }) => {
  const { data: garden, error, isLoading } = useSearchGardenByDOI(doi);

  useEffect(() => {
    if (garden) {
      console.log("Fetched Garden Object:", garden);
    }
  }, [garden]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Check console for the garden object</div>;
};

export default SampleGardenComponent;
