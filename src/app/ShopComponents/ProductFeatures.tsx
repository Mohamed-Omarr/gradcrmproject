"use client";
import React, { useState } from "react";
import NewArrivals from "./NewArrivals";
import BestSeller from "./BestSeller";

function FeatureSection() {
  const [Feature, setFeatures] = useState("New Arrivals");

  const isActive = (value: string) => Feature === value;

  return (
    <div className="bg-white p-6">
      <section className="flex justify-center gap-4 mb-6">
        {["New Arrivals", "Best Seller"].map((label) => (
          <button
            key={label}
            onClick={() => setFeatures(label)}
            className={`px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all duration-200 border ${
              isActive(label)
                ? "text-white bg-red-500 border-red-600 shadow-md"
                : "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200 hover:text-black"
            }`}
          >
            {label}
          </button>
        ))}
      </section>

      {Feature === "New Arrivals" ? <NewArrivals /> : <BestSeller />}
    </div>
  );
}

export default FeatureSection;
