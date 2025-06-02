"use client";
import React, {  useState } from "react";
import NewArrivals from "./NewArrivals";
import BestSeller from "./BestSeller";
import { useGetProductsQuery } from "../shop/redux/services/productApi";
import Loader from "../Loader";

function FeatureSection() {
  const [Feature, setFeatures] = useState("New Arrivals");
  const {
    data: product,
    isLoading,
    isSuccess,
    isError,
  } = useGetProductsQuery();

  if (isError) {
    return <p>Error fetching products</p>;
  }

  const isActive = (value: string) => Feature === value;

  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Products</h2>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              {["New Arrivals", "Best Seller"].map((label, index) => (
                <button
                  key={label}
                  onClick={() => setFeatures(label)}
                  type="button"
                  className={`px-4 py-2 text-sm font-medium focus:z-10 focus:outline-none transition-all duration-200 ${
                    isActive(label)
                      ? "text-white bg-gray-900"
                      : "text-gray-900 bg-gray-100 hover:bg-gray-200"
                  } ${index === 0 ? "rounded-l-lg" : "rounded-r-lg"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {isSuccess && (
            Feature === "New Arrivals" ? (
            <div
              role="tabpanel"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              <NewArrivals products={product.products} />
            </div>
          ) : (
            <div
              role="tabpanel"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
            >
              <BestSeller products={product.products} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default FeatureSection;
