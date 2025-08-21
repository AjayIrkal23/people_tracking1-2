import { Battery } from "@/interfaces/map";
import React, { useState, createContext } from "react";

type MapContextProviderProps = {
  children: React.ReactNode;
};

type MapContextType = {
  scale: number;
  isFullScreen: boolean;
  location: Battery;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  setIsFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
  setLocation: React.Dispatch<React.SetStateAction<Battery>>;
};

const MapContext = createContext({} as MapContextType);

export const MapProvider = ({ children }: MapContextProviderProps) => {
  const [scale, setScale] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [location, setLocation] = useState(Battery.one);

  return (
    <MapContext.Provider
      value={{
        isFullScreen,
        scale,
        location,
        setScale,
        setIsFullScreen,
        setLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapContext;
