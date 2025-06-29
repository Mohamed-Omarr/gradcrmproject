"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {  Edit, Save, X } from "lucide-react"

interface PersonalInfoTabProps {
  userData: {
    name: string
    email: string
    image: string
  }
  onUpdateUser: (userData: any) => void
}

export default function PersonalInfoTab({ userData, onUpdateUser }: PersonalInfoTabProps) {
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({ ...userData })
  const [hasChanges, setHasChanges] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const editButtonRef = useRef<HTMLButtonElement>(null)

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setHasChanges(true)
  }

  // Handle save
  const handleSave = () => {
    onUpdateUser(formData)
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
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        image: imageUrl,
      })
      setHasChanges(true)
    }
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
              onClick={handleSave}
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
              <Image src={formData.image || "/placeholder.svg"} alt={formData.name} fill className="object-cover" />
              {editMode && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
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

          {/* <div>
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
          </div> */}
          
        </div>

        {/* Edit mode buttons for mobile */}
        {editMode && (
          <div className="mt-6 flex flex-col sm:hidden space-y-2">
            <button
              onClick={handleSave}
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
  )
}
