import { Garden } from "@/api/types";
import React, { createContext, useState, useContext } from "react";

interface GardenContextType {
  garden: Garden | null;
  updateGarden: (garden: Garden) => void;
}

const GardenContext = createContext<GardenContextType>({
  garden: null,
  updateGarden: () => {},
});

export const GardenProvider = ({ children }: { children: React.ReactNode }) => {
  const [garden, setGarden] = useState<Garden | null>(null);

  const updateGarden = (garden: Garden) => {
    setGarden(garden);
  };

  return (
    <GardenContext.Provider
      value={{
        garden,
        updateGarden,
      }}
    >
      {children}
    </GardenContext.Provider>
  );
};

export const useGardenContext = () => useContext(GardenContext);
