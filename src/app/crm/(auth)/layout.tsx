import type React from "react";

import { ToastContainer } from "react-toastify";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
        <div className="flex flex-col">
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
