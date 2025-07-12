"use client";

import { ChevronDown, Home, Package } from "lucide-react";
import Link from "next/link";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({
    products: true, // Set to true to have it open by default
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }
  
  return (
    <ShadcnSidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>Matjar</span>
          </Link>
          <SidebarTrigger className="ml-auto md:hidden">
            <span className="sr-only">Toggle Sidebar</span>
          </SidebarTrigger>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleMenu("products")}
              className={cn(
                "justify-between",
                (pathname === "/crm/products" || pathname === "/crm/products/attributes") &&
                  "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4" />
                Products
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openMenus.products ? "rotate-180" : ""
                )}
              />
            </SidebarMenuButton>

            {openMenus.products && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/crm/products"}
                  >
                    <Link href="/crm/products">Products List</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === "/crm/products/attributes"}
                  >
                    <Link href="/crm/products/attributes">Attributes</Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/crm/categories">
                <Package className="mr-2 h-4 w-4" />
                Categories
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/crm/stocks">
                <Package className="mr-2 h-4 w-4" />
                Stocks
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/crm/orders">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/crm/customers">
                <Package className="mr-2 h-4 w-4" />
                Customers
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
