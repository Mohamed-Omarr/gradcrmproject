"use client";
import { AdminInfoProvider } from "@/hooks/crm/share-admin-context";
import { Header } from "./header";

export default function ClientLayout({ adminInfo , children }:{ adminInfo:adminData , children:React.ReactNode }) {
  return (
    <AdminInfoProvider initialAdminInfo={adminInfo}>
      <Header  />
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </AdminInfoProvider>
  );
}
