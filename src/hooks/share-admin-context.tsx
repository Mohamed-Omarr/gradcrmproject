"use client";
import { createContext, useState, ReactNode, useContext } from "react";

const adminInfoContext = createContext<adminData | null>(null);

export function AdminInfoProvider({
  children,
  initialAdminInfo,
}: {
  children: ReactNode;
  initialAdminInfo: adminData;
}) {
  const [adminInfo] = useState<adminData | null>(initialAdminInfo);

  return (
    <adminInfoContext.Provider value={adminInfo}>
      {children}
    </adminInfoContext.Provider>
  );
}

// custom hook to use admin info
export function useAdminInfo() {
  return useContext(adminInfoContext);
}
