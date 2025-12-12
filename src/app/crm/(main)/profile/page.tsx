"use client";
import { useState } from "react";
import { Mail, UserCircle, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAdminInfo } from "@/hooks/crm/share-admin-context";
import EmailSection from "@/app/crm/crm_component/profileSection/EmailSection";
import PasswordSection from "@/app/crm/crm_component/profileSection/PasswordSection";
import ProfileSection from "@/app/crm/crm_component/profileSection/ProfileSection";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const admin_info = useAdminInfo();

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {/* Horizontal Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 transition-colors",
              activeTab === "profile" && "border-primary text-foreground"
            )}
            onClick={() => setActiveTab("profile")}
          >
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile Information
            </div>
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 transition-colors",
              activeTab === "email" && "border-primary text-foreground"
            )}
            onClick={() => setActiveTab("email")}
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Change Email
            </div>
          </button>
          <button
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-foreground/80 transition-colors",
              activeTab === "password" && "border-primary text-foreground"
            )}
            onClick={() => setActiveTab("password")}
          >
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4" />
              Change Password
            </div>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <Card>
        {/* Profile Information */}
        {activeTab === "profile" && (
          <>
            <ProfileSection
              email={admin_info.email}
              name={admin_info.name}
              id={admin_info.id}
            />
          </>
        )}

        {/* Change Email */}
        {activeTab === "email" && (
          <>
            <EmailSection email={admin_info.email} id={admin_info.id} />
          </>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <>
            <PasswordSection email={admin_info.email} id={admin_info.id} />
          </>
        )}
      </Card>
    </div>
  );
}
