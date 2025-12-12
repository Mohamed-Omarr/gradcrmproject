"use client"
import type React from "react"
import { useState } from "react"
import { Check, Edit, MapPin, Trash, X } from "lucide-react"
import Loader from "../Loader"
import {
  useAddAddressMutation,
  useDeleteAddressMutation,
  useGetAddressQuery,
  useUpdateAddressMutation,
} from "../shop/redux/services/addressApi"
import { toastingError } from "@/lib/toast_message/toastingErrors"
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess"

export default function AddressesTab({
  customerInfo,
}: {
  customerInfo: customerData
}) {
  const [editAddress, setEditAddress] = useState<number | null>(null)
  const [newAddress, setNewAddress] = useState(false)
  const [newAddressData, setNewAddressData] = useState({
    id: 0,
    addressType: "Home", // Changed from 'type' to 'addressType'
    isDefault: false,
    street: "",
    city: "",
    zipCode: "",
    country: "",
  })

  // Add state to track the currently edited address data
  const [editedAddressData, setEditedAddressData] = useState<Address | null>(null)

  const {
    data: addresses = { all_Address: [] },
    isLoading: isLoadingGetAddress,
    isSuccess,
    isError,
  } = useGetAddressQuery()

  const [creatingAddress, { isLoading: isLoadingCreatingAddress }] = useAddAddressMutation()
  const [updatingAddress, { isLoading: isLoadingUpdatingAddress }] = useUpdateAddressMutation()
  const [deletingAddress, { isLoading: isLoadingDeletingAddress }] = useDeleteAddressMutation()

  const isAnyLoading =
    isLoadingGetAddress || isLoadingCreatingAddress || isLoadingUpdatingAddress || isLoadingDeletingAddress

  if (isError) {
    throw new Error("Failed fetching data")
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
      // Existing address - update local edited state
      if (editedAddressData && editedAddressData.id === addressId) {
        setEditedAddressData({
          ...editedAddressData,
          [name]: value,
        })
      }
    }
  }

  // Handle starting edit mode
  const handleStartEdit = (address: Address) => {
    setEditAddress(address.id)
    setEditedAddressData({ ...address }) // Create a copy for editing
  }

  // Handle saving edited address
  const handleSaveAddress = async () => {
    if (!editedAddressData) return

    const addressToUpdate = {
      id: editedAddressData.id,
      customerId: customerInfo.id,
      addressType: editedAddressData.addressType,
      street: editedAddressData.street,
      city: editedAddressData.city,
      country: editedAddressData.country,
      zipCode: editedAddressData.zipCode,
      default: editedAddressData.default,
    }

    const res = await updatingAddress(addressToUpdate)
    if (res.data) {
      setEditAddress(null)
      setEditedAddressData(null)
      toastingSuccess(res.data.message)
    } else {
      toastingError(res.error)
    }
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditAddress(null)
    setEditedAddressData(null)
  }

  // Handle set default address
  const handleSetDefaultAddress = async (currentId: number) => {
    const currentDefaultAddressId = addresses.all_Address.find((a) => a.default === true)
    
    const setAddressToDefault: setToDefaultAddress = {
      id: currentId,
      customerId: customerInfo.id,
      default: true,
      previousDefaultAddressId: currentDefaultAddressId?.id,
    }
    const res = await updatingAddress(setAddressToDefault)
    if (res.data) {
      setNewAddress(false)
      toastingSuccess(res.data.message)
    } else {
      toastingError(res.error)
    }
  }

  // Handle delete address
  const handleDeleteAddress = async (addressId: number) => {
    const addressToRemove: DeleteAddress = {
      id: addressId,
      customerId: customerInfo.id,
    }
    const res = await deletingAddress(addressToRemove)
    if (res.data) {
      setNewAddress(false)
      toastingSuccess(res.data.message)
    } else {
      toastingError(res.error)
    }
  }

  // Handle add new address
  const handleAddAddress = async () => {
    const isDefault = addresses.all_Address.length === 0
    const addressToAdd = {
      customerId: customerInfo.id,
      addressType: newAddressData.addressType,
      street: newAddressData.street,
      city: newAddressData.city,
      country: newAddressData.country,
      zipCode: newAddressData.zipCode,
      default: isDefault,
    }
    const res = await creatingAddress(addressToAdd)
    if (res.data) {
      setNewAddress(false)
      setNewAddressData({
        id: 0,
        addressType: "Home",
        isDefault: false,
        street: "",
        city: "",
        zipCode: "",
        country: "",
      })
      toastingSuccess(res.data.message)
    } else {
      toastingError(res.error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Addresses</h2>
        <button
          disabled={isAnyLoading}
          onClick={() => {
            setNewAddress(true)
            setEditAddress(null)
            setEditedAddressData(null)
          }}
          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          Add New Address
        </button>
      </div>

      {/* Address List */}
      {isAnyLoading ? (
        <Loader />
      ) : (
        isSuccess && (
          <>
            {addresses.all_Address.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses yet</h3>
                <p className="mt-1 text-sm text-gray-500">Add your first address to make checkout easier.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.all_Address.map((address, index) => (
                  <div
                    key={address.id || index}
                    className={`border rounded-lg p-4 ${
                      address.default ? "border-gray-900 bg-gray-50" : "border-gray-200"
                    }`}
                  >
                    {editAddress === address.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Edit Address</h3>
                          <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-500">
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Form fields */}
                          {["addressType", "street", "city", "zipCode", "country"].map((field) => (
                            <div key={field}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                              </label>
                              {field === "addressType" ? (
                                <select
                                  name={field}
                                  value={editedAddressData?.[field as keyof Address] || ""}
                                  onChange={(e) => handleAddressChange(e, address.id)}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                >
                                  <option value="Home">Home</option>
                                  <option value="Work">Work</option>
                                  <option value="Other">Other</option>
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  name={field}
                                  value={editedAddressData?.[field as keyof Address] || ""}
                                  onChange={(e) => handleAddressChange(e, address.id)}
                                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                            disabled={isLoadingUpdatingAddress}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveAddress}
                            className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-black disabled:opacity-50"
                            disabled={isLoadingUpdatingAddress}
                          >
                            {isLoadingUpdatingAddress ? "Saving..." : "Save Address"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <span className="font-medium text-gray-900">{address.addressType}</span>
                              {address.default && (
                                <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>{address.street}</p>
                              <p>
                                {address.city}, {address.zipCode}
                              </p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStartEdit(address)}
                              className="text-gray-400 hover:text-gray-500"
                              disabled={isAnyLoading}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            {addresses.all_Address.length > 1 && (
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-gray-400 hover:text-red-500"
                                disabled={isAnyLoading}
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                        {!address.default && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="mt-3 text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center disabled:opacity-50"
                            disabled={isAnyLoading}
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
          </>
        )
      )}

      {/* Add New Address */}
      {newAddress && (
        <div className="mt-6 border rounded-lg border-gray-300 p-4">
          <div className="flex justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
            <button onClick={() => setNewAddress(false)} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["addressType", "street", "city", "zipCode", "country"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}
                </label>
                {field === "addressType" ? (
                  <select
                    name={field}
                    value={newAddressData[field as keyof typeof newAddressData] || ""}
                    onChange={(e) => handleAddressChange(e, null)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={newAddressData[field as keyof typeof newAddressData] || ""}
                    onChange={(e) => handleAddressChange(e, null)}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setNewAddress(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              disabled={isLoadingCreatingAddress}
            >
              Cancel
            </button>
            <button
              onClick={handleAddAddress}
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-black disabled:opacity-50"
              disabled={isLoadingCreatingAddress}
            >
              {isLoadingCreatingAddress ? "Adding..." : "Add Address"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
