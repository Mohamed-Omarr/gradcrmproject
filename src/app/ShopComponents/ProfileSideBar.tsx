"use client";
import { CreditCard, LogOut, MapPin, Package, User } from "lucide-react";

interface ProfileSidebarProps {
  userData: customerData,
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasUnsavedChanges?: boolean;
  onConfirmTabChange?: () => void;
}

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "cards", label: "Payment Methods", icon: CreditCard },
  { id: "orders", label: "Orders", icon: Package },
];

export default function ProfileSidebar({
  activeTab,
  onTabChange,
  hasUnsavedChanges = false,
  onConfirmTabChange,
}: ProfileSidebarProps) {
  const handleTabClick = (tabId: string) => {
    if (hasUnsavedChanges && onConfirmTabChange) {
      onConfirmTabChange();
    } else {
      onTabChange(tabId);
    }
  };

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        {/* Navigation tabs */}
        <nav className="p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                activeTab === tab.id
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <tab.icon className="h-5 w-5 mr-3" />
              {tab.label}
            </button>
          ))}

          {/* Logout button */}
          <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md mt-2">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}
