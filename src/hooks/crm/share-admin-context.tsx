"use client";
import { createContext, ReactNode, useContext } from "react";

const adminInfoContext = createContext<adminData | undefined>(undefined);

export function AdminInfoProvider({
  children,
  initialAdminInfo,
}: {
  children: ReactNode;
  initialAdminInfo: adminData;
}) {

  return (
    <adminInfoContext.Provider value={initialAdminInfo}>
      {children}
    </adminInfoContext.Provider>
  );
}

// custom hook to use admin info
export function useAdminInfo() {
  const context = useContext(adminInfoContext);
  if (!context) {
    throw new Error("useAdminInfo must be used within an AdminInfoProvider");
  }
  return context;
}
