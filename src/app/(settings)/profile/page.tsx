"use client"

import { useState } from "react"
import Link from "next/link"
import AddressesTab from "@/app/ShopComponents/AddressesTab"
import OrdersTab from "@/app/ShopComponents/OrdersTab"
import PersonalInfoTab from "@/app/ShopComponents/PersonalInfoTab"
import ProfileSidebar from "@/app/ShopComponents/ProfileSideBar"

// Mock user data - in a real app, this would come from your authentication system
const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  // image: "https://picsum.photos/seed/user/200",
  addresses: [
    {
      id: 1,
      type: "Home",
      isDefault: true,
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
    },
    {
      id: 2,
      type: "Work",
      isDefault: false,
      street: "456 Office Park",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States",
    },
  ],
  orders: [
    {
      id: "ORD-12345",
      date: "2023-05-15",
      total: 129.99,
      status: "Delivered",
      items: 3,
    },
    {
      id: "ORD-12346",
      date: "2023-04-22",
      total: 79.98,
      status: "Processing",
      items: 2,
    },
    {
      id: "ORD-12347",
      date: "2023-03-10",
      total: 45.99,
      status: "Delivered",
      items: 1,
    },
  ],
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [userData, setUserData] = useState(initialUserData)

  // Handle user data updates
  const handleUpdateUser = (updatedUserData: any) => {
    setUserData({
      ...userData,
      ...updatedUserData,
    })
  }


  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab userData={userData} onUpdateUser={handleUpdateUser} />
      case "addresses":
        return <AddressesTab  />
      case "orders":
        return <OrdersTab orders={userData.orders} />
      default:
        return <PersonalInfoTab userData={userData} onUpdateUser={handleUpdateUser} />
    }
  }

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
          <ProfileSidebar userData={userData} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
