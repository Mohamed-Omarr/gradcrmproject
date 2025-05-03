"use client";
import { Bell, ChevronDown, Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import { useRouter } from "next/navigation";
import axiosAdmin from "@/lib/axios/axiosAdmin";

export function Header() {
  const admin_info = useAdminInfo();
  const router = useRouter();

  const onLogout = async () => {
    await axiosAdmin
      .post("auth/logout", {
        userId: admin_info?.id,
        userRole: admin_info?.role,
      })
      .then(() => localStorage.removeItem("access_token"))
      .catch((err) => console.error(err));
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6">
      <SidebarTrigger className="h-8 w-8 flex items-center justify-center">
        <span className="sr-only">Toggle Sidebar</span>
      </SidebarTrigger>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium">{admin_info?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {admin_info?.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/crm/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onLogout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
