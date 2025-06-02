"use client";
import { createContext, useState, ReactNode, useContext } from "react";

const customerInfoContext = createContext<customerData | null>(null);

export function CustomerInfoProvider({
  children,
  initialCustomerInfo,
}: {
  children: ReactNode;
  initialCustomerInfo: customerData;
}) {
  const [customerInfo] = useState<customerData | null>(initialCustomerInfo);

  return (
    <customerInfoContext.Provider value={customerInfo}>
      {children}
    </customerInfoContext.Provider>
  );
}

// custom hook to use admin info
export function useCustomerInfo() {
  return useContext(customerInfoContext);
}
