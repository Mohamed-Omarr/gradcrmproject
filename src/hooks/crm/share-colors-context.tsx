"use client";
import { createContext, useState, ReactNode, useContext } from "react";

const colorsContext = createContext<Colors[] | []>([]);

export function ColorsProvider({
  children,
  initialColors,
}: {
  children: ReactNode;
  initialColors: Colors[];
}) {
  const [colors] = useState<Colors[] | []>(initialColors);

  return (
    <colorsContext.Provider value={colors}>
      {children}
    </colorsContext.Provider>
  );
}

// custom hook to use admin info
export function useColors() {
  return useContext(colorsContext);
}
