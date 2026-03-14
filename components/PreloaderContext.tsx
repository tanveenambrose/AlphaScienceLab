"use client";

import React, { createContext, useContext, useState } from "react";

interface PreloaderContextType {
  preloaderFinished: boolean;
  setPreloaderFinished: (val: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  preloaderFinished: false,
  setPreloaderFinished: () => {},
});

export const PreloaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  return (
    <PreloaderContext.Provider value={{ preloaderFinished, setPreloaderFinished }}>
      {children}
    </PreloaderContext.Provider>
  );
};

export const usePreloader = () => useContext(PreloaderContext);
