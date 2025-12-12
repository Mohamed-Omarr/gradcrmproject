"use client";
import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Edit, Save, X } from "lucide-react";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import axiosClient from "@/lib/axios/axiosClient";
import {
  useUpdateCustomerInfoEmailMutation,
  useUpdateCustomerInfoNameMutation,
} from "../shop/redux/services/customerInfoApi";
import Loader from "../Loader";

export default function PersonalInfoTab({
  userData,
}: {
  userData: customerData;
}) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    ...userData,
    password: "",
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const [showPasswordChange, setShowPasswordChange] = useState<boolean>(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string;
  }>({});

  // Check if name or email has changed (for password requirement)
  const hasNameOrEmailChanged = () => {
    return formData.name !== userData.name || formData.email !== userData.email;
  };

  // Validate password requirements
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/\d/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("One special character");
    return errors;
  };

  // Validate password change form
  const validatePasswordForm = () => {
    const errors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else {
      const passwordValidationErrors = validatePassword(
        passwordData.newPassword
      );
      if (passwordValidationErrors.length > 0) {
        errors.newPassword = `Password must have: ${passwordValidationErrors.join(
          ", "
        )}`;
      }
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Check if there are any changes from original data
    const hasDataChanges =
      newFormData.name !== userData.name ||
      newFormData.email !== userData.email;
    setHasChanges(hasDataChanges);

    // Clear password if name and email are reverted to original
    if (!hasDataChanges) {
      setFormData((prev) => ({ ...prev, password: "" }));
    }
  };

  // Handle password form input changes
  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    // Clear specific error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: "",
      });
    }
  };

  const [updateCustomerName] = useUpdateCustomerInfoNameMutation();
  const [updateCustomerEmail] = useUpdateCustomerInfoEmailMutation();

  // Update user name
  const onUpdatingName = async () => {
    try {
      const item = {
        id: userData.id,
        previousName: userData.name,
        newName: formData.name,
      };

      const res = await updateCustomerName(item);
      if (res.data) {
        toastingSuccess(res.data.message);
      } else {
        toastingError(res.error);
      }
    } catch (err) {
      return toastingError(err);
    }
  };

  // Update user email
  const onUpdatingEmail = async () => {
    try {
      const item = {
        id: userData.id,
        previousEmail: userData.email,
        newEmail: formData.email,
        password: formData.password,
      };
      const res = await updateCustomerEmail(item);

      if (res.data) {
        toastingSuccess(res.data.message);
      } else {
        toastingError(res.error);
      }
    } catch (err) {
      return toastingError(err);
    }
  };

  // Handle password change
  const onChangingPassword = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await axiosClient.post("profile/updateCustomerPassword", {
        id: userData.id,
        email: userData.email,
        confirmNewPassword: passwordData.confirmPassword,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
      setPasswordErrors({});
      toastingSuccess(res.data.message);
    } catch (err) {
      toastingError(err);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle cancel password change
  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setShowPasswordChange(false);
  };

  // Handle save
  const handleSave = async () => {
    if (hasNameOrEmailChanged() && !formData.password) {
      toastingError("Password is required to update your name or email");
      return;
    }
    setIsSaving(true);
    try {
      if (formData.name !== userData.name) {
        await onUpdatingName();
      }
      if (formData.email !== userData.email) {
        await onUpdatingEmail();
      }
      setEditMode(false);
      setHasChanges(false);
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      resetForm();
    }
  };

  // Reset form to original data
  const resetForm = () => {
    setFormData({ ...userData, password: "" });
    setEditMode(false);
    setHasChanges(false);
    setShowDiscardConfirm(false);
  };

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
          setShowDiscardConfirm(true);
        } else {
          resetForm();
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editMode, hasChanges]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Personal Information
        </h2>
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
              disabled={isSaving}
              onClick={handleCancelEdit}
              className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            <button
              disabled={!hasChanges || isSaving}
              onClick={handleSave}
              className={`flex items-center text-sm font-medium text-white 
          ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
          } 
          px-3 py-1.5 rounded-md transition-colors`}
            >
              {isSaving ? <Loader /> : <Save className="h-4 w-4 mr-1.5" />}
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
              <h3 className="text-sm font-medium text-yellow-800">
                Discard changes?
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have unsaved changes. Are you sure you want to discard
                  them?
                </p>
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
        className={`transition-all duration-200 ${
          editMode ? "bg-gray-50 p-6 rounded-lg border border-gray-200" : ""
        }`}
      >
        {/* Personal Info Form */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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

          {/* Conditional Password Field */}
          {editMode && hasNameOrEmailChanged() && (
            <div className="pt-4 border-t border-gray-200">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your current password to confirm changes"
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Password is required to update your name or email address
              </p>
            </div>
          )}
        </div>

        {/* Edit mode buttons for mobile */}
        {editMode && (
          <div className="mt-6 flex flex-col sm:hidden space-y-2">
            <button
              disabled={!hasChanges || isSaving}
              onClick={handleSave}
              className={`flex items-center text-sm font-medium text-white 
          ${
            isSaving
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
          } 
          px-3 py-1.5 rounded-md transition-colors`}
            >
              {isSaving ? <Loader /> : <Save className="h-4 w-4 mr-1.5" />}
              Save Changes
            </button>
            <button
              disabled={isSaving}
              onClick={handleCancelEdit}
              className="w-full flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors"
            >
              <X className="h-4 w-4 mr-1.5" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password Change Section - Only show when not editing or no name/email changes */}
      {(!editMode || !hasNameOrEmailChanged()) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Change Password
            </button>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Current Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                      passwordErrors.currentPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                      passwordErrors.newPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordErrors.newPassword}
                    </p>
                  )}
                  {!passwordErrors.newPassword && passwordData.newPassword && (
                    <div className="mt-1">
                      <div className="text-xs text-gray-600 mb-1">
                        Password strength:
                      </div>
                      <div className="flex space-x-1">
                        {validatePassword(passwordData.newPassword).length ===
                        0 ? (
                          <div className="flex-1 h-1 bg-green-500 rounded"></div>
                        ) : validatePassword(passwordData.newPassword).length <=
                          2 ? (
                          <>
                            <div className="flex-1 h-1 bg-yellow-500 rounded"></div>
                            <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 h-1 bg-red-500 rounded"></div>
                            <div className="flex-1 h-1 bg-gray-200 rounded"></div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordInputChange}
                    className={`w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                      passwordErrors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                  {!passwordErrors.confirmPassword &&
                    passwordData.confirmPassword &&
                    passwordData.newPassword ===
                      passwordData.confirmPassword && (
                      <p className="mt-1 text-xs text-green-600">
                        ✓ Passwords match
                      </p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• One uppercase letter (A-Z)</li>
                    <li>• One lowercase letter (a-z)</li>
                    <li>• One number (0-9)</li>
                    <li>• One special character (!@#$%^&*)</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={onChangingPassword}
                    disabled={isUpdatingPassword}
                    className={`flex items-center px-4 py-2 
          ${
            isUpdatingPassword
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:bg-black"
          } 
          text-white text-sm font-medium rounded-md transition-colors`}
                  >
                    {isUpdatingPassword ? (
                      <Loader />
                    ) : (
                      <Save className="h-4 w-4 mr-1.5" />
                    )}
                    Update Password
                  </button>
                  <button
                    disabled={isUpdatingPassword}
                    onClick={handleCancelPasswordChange}
                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
