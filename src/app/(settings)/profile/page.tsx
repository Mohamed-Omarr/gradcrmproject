"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Camera, Check, ChevronRight, Edit, LogOut, MapPin, Package, Save, Trash, User, X } from "lucide-react"

// Mock user data - in a real app, this would come from your authentication system
const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  image: "https://picsum.photos/seed/user/200",
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

// Tab options for profile sections
const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "orders", label: "Orders", icon: Package },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [userData, setUserData] = useState(initialUserData)
  const [editMode, setEditMode] = useState(false)
  const [editAddress, setEditAddress] = useState<number | null>(null)
  const [newAddress, setNewAddress] = useState(false)
  const [formData, setFormData] = useState({ ...userData })
  const [newAddressData, setNewAddressData] = useState({
    id: 0,
    type: "Home",
    isDefault: false,
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)

  // Handle input changes for personal info
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setHasChanges(true)
  }

  // Handle save personal info
  const handleSavePersonalInfo = () => {
    setUserData(formData)
    setEditMode(false)
    setHasChanges(false)
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (hasChanges) {
      setShowDiscardConfirm(true)
    } else {
      resetForm()
    }
  }

  // Reset form to original data
  const resetForm = () => {
    setFormData({ ...userData })
    setEditMode(false)
    setHasChanges(false)
    setShowDiscardConfirm(false)
  }

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload this file to your server/cloud storage
      // For this demo, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        image: imageUrl,
      })
      setHasChanges(true)
    }
  }

  // Handle address input changes
  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    addressId: number | null,
  ) => {
    const { name, value } = e.target

    if (addressId === null) {
      // New address
      setNewAddressData({
        ...newAddressData,
        [name]: value,
      })
    } else {
      // Existing address
      const updatedAddresses = userData.addresses.map((address) => {
        if (address.id === addressId) {
          return {
            ...address,
            [name]: value,
          }
        }
        return address
      })

      setUserData({
        ...userData,
        addresses: updatedAddresses,
      })
    }
  }

  // Handle set default address
  const handleSetDefaultAddress = (addressId: number) => {
    const updatedAddresses = userData.addresses.map((address) => ({
      ...address,
      isDefault: address.id === addressId,
    }))

    setUserData({
      ...userData,
      addresses: updatedAddresses,
    })
  }

  // Handle delete address
  const handleDeleteAddress = (addressId: number) => {
    const updatedAddresses = userData.addresses.filter((address) => address.id !== addressId)

    // If we deleted the default address, set a new default
    if (updatedAddresses.length > 0 && !updatedAddresses.some((address) => address.isDefault)) {
      updatedAddresses[0].isDefault = true
    }

    setUserData({
      ...userData,
      addresses: updatedAddresses,
    })
  }

  // Handle add new address
  const handleAddAddress = () => {
    const newId = Math.max(0, ...userData.addresses.map((a) => a.id)) + 1
    const isDefault = userData.addresses.length === 0

    const addressToAdd = {
      ...newAddressData,
      id: newId,
      isDefault,
    }

    setUserData({
      ...userData,
      addresses: [...userData.addresses, addressToAdd],
    })

    setNewAddress(false)
    setNewAddressData({
      id: 0,
      type: "Home",
      isDefault: false,
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    })
  }

  // Handle click outside form
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editMode &&
        formRef.current &&
        !formRef.current.contains(event.target as Node) &&
        editButtonRef.current &&
        !editButtonRef.current.contains(event.target as Node)
      ) {
        if (hasChanges) {
          setShowDiscardConfirm(true)
        } else {
          resetForm()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editMode, hasChanges])

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
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Profile summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200">
                    
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-medium text-gray-900">{userData.name}</h2>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation tabs */}
              <nav className="p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (editMode && hasChanges) {
                        setShowDiscardConfirm(true)
                      } else {
                        setActiveTab(tab.id)
                        resetForm()
                      }
                    }}
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

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Personal Info Tab */}
              {activeTab === "personal" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    {!editMode ? (
                      <button
                        ref={editButtonRef}
                        onClick={() => setEditMode(true)}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1.5" />
                        Edit Profile
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </button>
                        <button
                          onClick={handleSavePersonalInfo}
                          className="flex items-center text-sm font-medium text-white bg-gray-900 hover:bg-black px-3 py-1.5 rounded-md transition-colors"
                        >
                          <Save className="h-4 w-4 mr-1.5" />
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Discard changes confirmation */}
                  {showDiscardConfirm && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Discard changes?</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>You have unsaved changes. Are you sure you want to discard them?</p>
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <button
                              type="button"
                              onClick={resetForm}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none"
                            >
                              Discard changes
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowDiscardConfirm(false)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                              Continue editing
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile form */}
                  <div
                    ref={formRef}
                    className={`transition-all duration-200 ${editMode ? "bg-gray-50 p-6 rounded-lg border border-gray-200" : ""}`}
                  >
                    {/* Profile Image */}
                    <div className="mb-6">
                      <div className="flex flex-col items-center">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-gray-200 mb-4 group">
                          
                          {editMode && (
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Camera className="h-6 w-6" />
                              <span className="sr-only">Change profile picture</span>
                            </button>
                          )}
                        </div>
                        {editMode && (
                          <>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageChange}
                              accept="image/*"
                              className="hidden"
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                              Change photo
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Personal Info Form */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{userData.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        {editMode ? (
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{userData.email}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{userData.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Edit mode buttons for mobile */}
                    {editMode && (
                      <div className="mt-6 flex flex-col sm:hidden space-y-2">
                        <button
                          onClick={handleSavePersonalInfo}
                          className="w-full flex items-center justify-center text-sm font-medium text-white bg-gray-900 hover:bg-black px-3 py-2 rounded-md transition-colors"
                        >
                          <Save className="h-4 w-4 mr-1.5" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="w-full flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Password Change Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Change Password
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
                    <button
                      onClick={() => {
                        setNewAddress(true)
                        setEditAddress(null)
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                    >
                      Add New Address
                    </button>
                  </div>

                  {/* Address List */}
                  {userData.addresses.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Add your first address to make checkout easier.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userData.addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 ${
                            address.isDefault ? "border-gray-900 bg-gray-50" : "border-gray-200"
                          }`}
                        >
                          {editAddress === address.id ? (
                            // Edit address form
                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <h3 className="text-lg font-medium text-gray-900">Edit Address</h3>
                                <button
                                  onClick={() => setEditAddress(null)}
                                  className="text-gray-400 hover:text-gray-500"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                                  <select
                                    name="type"
                                    value={address.type}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  >
                                    <option value="Home">Home</option>
                                    <option value="Work">Work</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                  <input
                                    type="text"
                                    name="street"
                                    value={address.street}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                  <input
                                    type="text"
                                    name="city"
                                    value={address.city}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                  <input
                                    type="text"
                                    name="state"
                                    value={address.state}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                  <input
                                    type="text"
                                    name="zipCode"
                                    value={address.zipCode}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                  <input
                                    type="text"
                                    name="country"
                                    value={address.country}
                                    onChange={(e) => handleAddressChange(e, address.id)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-end space-x-3 mt-4">
                                <button
                                  onClick={() => setEditAddress(null)}
                                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => setEditAddress(null)}
                                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                                >
                                  Save Address
                                </button>
                              </div>
                            </div>
                          ) : (
                            // Address display
                            <>
                              <div className="flex justify-between">
                                <div className="flex items-center">
                                  <span className="font-medium text-gray-900">{address.type}</span>
                                  {address.isDefault && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => setEditAddress(address.id)}
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    <Edit className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAddress(address.id)}
                                    className="text-gray-400 hover:text-red-500"
                                  >
                                    <Trash className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>

                              <div className="mt-2 text-gray-600">
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.state} {address.zipCode}
                                </p>
                                <p>{address.country}</p>
                              </div>

                              {!address.isDefault && (
                                <button
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                  className="mt-3 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Set as default
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {newAddress && (
                    <div className="mt-6 border rounded-lg border-gray-300 p-4">
                      <div className="flex justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
                        <button onClick={() => setNewAddress(false)} className="text-gray-400 hover:text-gray-500">
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                          <select
                            name="type"
                            value={newAddressData.type}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            name="street"
                            value={newAddressData.street}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            name="city"
                            value={newAddressData.city}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <input
                            type="text"
                            name="state"
                            value={newAddressData.state}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            value={newAddressData.zipCode}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <input
                            type="text"
                            name="country"
                            value={newAddressData.country}
                            onChange={(e) => handleAddressChange(e, null)}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                            checked={newAddressData.isDefault || userData.addresses.length === 0}
                            onChange={(e) =>
                              setNewAddressData({
                                ...newAddressData,
                                isDefault: e.target.checked,
                              })
                            }
                            disabled={userData.addresses.length === 0}
                          />
                          <span className="ml-2 text-sm text-gray-600">Set as default address</span>
                        </label>
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => setNewAddress(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddAddress}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                        >
                          Add Address
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>

                  {userData.orders.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <Package className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                      <p className="mt-1 text-sm text-gray-500">When you place an order, it will appear here.</p>
                      <div className="mt-6">
                        <Link
                          href="/products"
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black"
                        >
                          Start Shopping
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Order ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">View</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {userData.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.status === "Delivered"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link
                                  href={`/orders/${order.id}`}
                                  className="text-gray-600 hover:text-gray-900 flex items-center justify-end"
                                >
                                  View Details
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
