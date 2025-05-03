"use client";
import { createContext, useState, ReactNode, useContext } from "react";

const sizesContext = createContext<Sizes[] | []>([]);

export function SizesProvider({
  children,
  initialSizes,
}: {
  children: ReactNode;
  initialSizes: Sizes[];
}) {
  const [sizes] = useState<Sizes[] | []>(initialSizes);

  return (
    <sizesContext.Provider value={sizes}>
      {children}
    </sizesContext.Provider>
  );
}

// custom hook to use admin info
export function useSizes() {
  return useContext(sizesContext);
}
