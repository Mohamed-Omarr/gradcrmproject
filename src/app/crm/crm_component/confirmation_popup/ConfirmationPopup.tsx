"use client";
import React from "react";

const ConfirmationPopup = ({
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: {
  title: "Please confirm the following process";
  message: "please click on yes or cancel";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-96 p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onCancel()}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm()}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Submitting..." : "Yes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
