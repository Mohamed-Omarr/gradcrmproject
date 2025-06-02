"use client";
import React from "react";
import Loader from "../Loader";
import { useGetCategoriesQuery } from "../shop/redux/services/categoryApi";
import ShopByCategories from "./ShopByCategories";

function CategorySection() {
  const {
    data: category,
    isLoading,
    isSuccess,
    isError,
  } = useGetCategoriesQuery();

  if (isError) {
    return <p>Error fetching categories</p>;
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
              {isSuccess && (
                <ShopByCategories categories={category.categories} />
              )}
          </div>
        </div>
      )}
    </>
  );
}

export default CategorySection;
