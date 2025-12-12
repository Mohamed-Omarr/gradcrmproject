"use client";
import { useState } from "react";
import Link from "next/link";
import AddressesTab from "@/app/ShopComponents/AddressesTab";
import OrdersTab from "@/app/ShopComponents/OrdersTab";
import PersonalInfoTab from "@/app/ShopComponents/PersonalInfoTab";
import ProfileSidebar from "@/app/ShopComponents/ProfileSideBar";
import CardsTab from "@/app/ShopComponents/CardsTab";
import { IsCustomerAuthed } from "@/lib/utils";
import { useGetCustomerInfoQuery } from "../../shop/redux/services/customerInfoApi";
import { toastingInfo } from "@/lib/toast_message/toastingInfo";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const isAuthed = IsCustomerAuthed();
  const router = useRouter();
  const {
    data: userData,
    isLoading: isUserDataInfoLoading,
    isError: isUserDataInfoError,
    isSuccess: isUserDataInfoSuccess,
  } = useGetCustomerInfoQuery(undefined, {
    skip: !isAuthed,
  });

  // Show loading state
  if (isUserDataInfoLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading your account...</p>
      </div>
    );
  }

  // Show error message
  if (isUserDataInfoError ) {
    toastingInfo("Failed getting customer Info", router);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Failed to load account information.</p>
      </div>
    );
  }

  // If user data is missing for some reason
  if (isUserDataInfoSuccess && !userData?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No user data found.</p>
      </div>
    )
  }

  // Type guard to ensure userData.user exists
  if (!userData?.user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    )
  }

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab userData={userData.user} />;
      case "addresses":
        return <AddressesTab customerInfo={userData.user} />;
      case "cards":
        return <CardsTab />;
      case "orders":
        return <OrdersTab />;
      default:
        return <PersonalInfoTab userData={userData.user} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">My Account</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <ProfileSidebar
            userData={userData.user}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
