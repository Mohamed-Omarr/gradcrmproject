import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/crm/crm_component/layout_style/sidebar";
import { Header } from "@/app/crm/crm_component/layout_style/header";
import { ToastContainer } from "react-toastify";
import { AdminInfoProvider } from "@/hooks/share-admin-context";
import { limitedAdminInfo } from "@/globalData/shartLimitedAdminInfo";

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const adminInfo = await limitedAdminInfo();


  return (
    <>
      <AdminInfoProvider initialAdminInfo={adminInfo}>
        <SidebarProvider defaultOpen={true}>
          <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
            <AppSidebar />
            <div className="flex flex-col">
              <Header />
              <main className="flex-1 p-4 md:p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
        <ToastContainer />
      </AdminInfoProvider>
    </>
  );
}
