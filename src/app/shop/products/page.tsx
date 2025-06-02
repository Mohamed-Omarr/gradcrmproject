"use client";
import { useState, useMemo, useEffect } from "react";
import {
  ChevronDown,
  Filter,
  Heart,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "../redux/services/productApi";
import Loader from "@/app/Loader";
import { useGetCategoriesQuery } from "../redux/services/categoryApi";
import { useCustomerInfo } from "@/hooks/crm/share-customer-context";
import {
  useAddToWishlistItemMutation,
  useDeleteWishlistItemMutation,
} from "../redux/services/wishlistApi";

export default function AllProductsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [hightPrice, setHightPrice] = useState<number>(0);
  const [lowestPrice, setLowestPrice] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<{
    categories: string[];
    priceRange: number[];
  }>({
    categories: [],
    priceRange: [0, 0],
  });
  const [sortStatus, setSortStatus] = useState<string>("featured");
  const router = useRouter();

  const {
    data: products,
    isLoading: isProductLoading,
    isSuccess: isProductSuccess,
    isError: isProductError,
  } = useGetProductsQuery();

  const {
    data: categories,
    isLoading: isCategoryLoading,
    isSuccess: isCategorySuccess,
    isError: isCategoryError,
  } = useGetCategoriesQuery();

  // add to wishlist
  const customerInfo = useCustomerInfo();

  if (!customerInfo) {
    throw new Error("Failed getting customer Info");
  }

  const [removeWishListItem] = useDeleteWishlistItemMutation();

  const [addToWishlistItem] = useAddToWishlistItemMutation();

  const addingToWishlist = async (itemId: number) => {
    const item = {
      productId: itemId,
      customerId: customerInfo.id,
    };
    
    const res = await addToWishlistItem(item);

    if (res.data) {
      toastingSuccess(res.data.message, router.refresh);
    } else {
      toastingError(res.error);
    }
  };

  const removeFromWishList = async (itemId: number) => {
    const item = {
      productId: itemId,
      customerId: customerInfo.id,
    };
    const res = await removeWishListItem(item);
    if (res.data) {
      toastingSuccess(res.data.message, router.refresh);
    } else {
      toastingError(res.error);
    }
  };

  // handling filter product
  const filteredProducts = useMemo(() => {
    if (!products || products.products.length === 0) return [];

    let result = [...products.products];

    if (filter.categories && filter.categories.length > 0) {
      result = result.filter((product) =>
        filter.categories.some((category) =>
          product.category.name.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    if (filter.priceRange[0] > 0 || filter.priceRange[1] > 0) {
      result = result.filter(
        (product) =>
          Number(product.price) >= filter.priceRange[0] &&
          Number(product.price) <= filter.priceRange[1]
      );
    }

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    // stock status filter
    switch (sortStatus) {
      case "price-high-low":
        result = result.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "price-low-high":
        result = result.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "newest":
        result = result.filter((product) => product.qty === 0);
        break;

      case "featured":
        break;
      default:
        setSortStatus("featured");
        break;
    }

    return result;
  }, [filter, products, searchQuery, sortStatus]);

  useEffect(() => {
    if (isProductSuccess && products.products.length > 0) {
      const prices = products.products.map((p: ShopProduct) => p.price);
      const maxPrice = Math.max(...prices);
      const minPrice = Math.min(...prices);

      setHightPrice(maxPrice);
      setLowestPrice(minPrice);

      // If you want to update filter as well
      // setFilter((prev) => ({
      //   ...prev,
      //   priceRange: [minPrice, maxPrice],
      // }));
    }
  }, [isProductSuccess, products]);

  if (isProductError) {
    return <p>Failed to fetch products</p>;
  }

  if (isCategoryError) {
    return <p>Error fetching categories</p>;
  }

  const handleCategoryChange = (categoryName: string) => {
    const updatedCategory = filter.categories.includes(categoryName);
    if (updatedCategory) {
      setFilter((prev) => ({
        ...prev,
        categories: prev.categories.filter((item) => item !== categoryName),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        categories: [...prev.categories, categoryName],
      }));
    }
  };

  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="mt-1 text-sm text-gray-500">
              showing total product numbers
            </p>
          </div>

          {/* Mobile filter button */}
          <button
            className="mt-4 md:hidden flex items-center text-sm font-medium text-gray-700"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>

          {/* Sort dropdown - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <label htmlFor="sort" className="text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort"
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={sortStatus}
                onChange={(e) => setSortStatus(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="newest">Newest</option>
                {/* <option value="rating">Top Rated</option> */}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                {/* {(filters.categories.length > 0 ||
                  filters.colors.length > 0 ||
                  filters.sizes.length > 0 ||
                  filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 200) && (
                  <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                    Clear all
                  </button>
                )} */}
              </div>

              {/* Search */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Categories
                </h3>
                <div className="space-y-2">
                  {isCategoryLoading ? (
                    <Loader />
                  ) : (
                    isCategorySuccess &&
                    categories.categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleCategoryChange(category.name)}
                          className={`h-10 px-4 py-2 rounded border text-sm ${
                            filter.categories.includes(category.name)
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.name}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Price Range
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">${lowestPrice}</span>
                  <span className="text-sm text-gray-600">${hightPrice}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-price" className="sr-only">
                      Minimum Price
                    </label>
                    <input
                      type="number"
                      id="min-price"
                      min={lowestPrice}
                      max={hightPrice}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      value={filter.priceRange[0]}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          priceRange: [
                            Number(e.target.value),
                            prev.priceRange[1],
                          ],
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="sr-only">
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      id="max-price"
                      min={lowestPrice}
                      max={hightPrice}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      value={filter.priceRange[1]}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            Number(e.target.value),
                          ],
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Colors
                </h3>
                <div className="space-y-2">display ll colors</div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Sizes
                </h3>
                <div className="grid grid-cols-4 gap-2">display ll sizes</div>
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1">
            {isProductLoading ? (
              <Loader />
            ) : filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const scores = item.ratings?.map((r) => r.score) || [];
                const total = scores.reduce((acc, score) => acc + score, 0);
                const avgRatingScore = scores.length
                  ? total / scores.length
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1 max-w-[400px] duration-300"
                  >
                    {/* Wishlist button */}
                    <div className="absolute  top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          item.isWishListed
                            ? removeFromWishList(item.id)
                            : addingToWishlist(item.id)
                        }
                        className="rounded-full hover:cursor-pointer bg-white p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                      >
                        <Heart fill={item.isWishListed ? "red" : "white"} />
                      </button>
                    </div>

                    {/* Product image */}
                    <Link href={`/product`}>
                      <div className="bg-gray-50">
                        <Image
                          src={item.thumbnail}
                          alt="Product image"
                          width={220}
                          height={330}
                          className="h-[330px] w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Product details */}
                    <div className="p-4 space-y-2">
                      {/* Rating */}
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill={
                              i < Math.floor(avgRatingScore)
                                ? "currentColor"
                                : "none"
                            }
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={
                              i < Math.floor(avgRatingScore)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-600">
                          {avgRatingScore.toFixed(1)}
                        </span>
                      </div>

                      {/* Product name */}
                      <h3 className="text-sm font-semibold line-clamp-1 text-gray-900">
                        {item.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-gray-900">
                          ${item.price}
                        </p>
                      </div>

                      {/* Add to cart button */}
                      <button className="w-full flex items-center justify-center rounded-md bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300">
                        <ShoppingCart /> Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products</p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter dialog */}
      {filterOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            onClick={() => setFilterOpen(false)}
          />

          {/* Dialog */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setFilterOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-4 pt-4">
              {/* Search */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Search
                </h3>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
                    placeholder="Search products..."
                    value={searchQuery}
                  />
                  <Search className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Sort by
                </h3>
                <select
                  className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm"
                  // value={filters.sort}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Categories
                </h3>
                <div className="space-y-2">all categ</div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Price Range
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">${lowestPrice}</span>
                  <span className="text-sm text-gray-600">${hightPrice}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="mobile-min-price" className="sr-only">
                      Minimum Price
                    </label>
                    <input
                      type="number"
                      id="mobile-min-price"
                      min={lowestPrice}
                      max={hightPrice}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      value={filter.priceRange[0]}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          priceRange: [
                            Number(e.target.value),
                            prev.priceRange[1],
                          ],
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="mobile-max-price" className="sr-only">
                      Maximum Price
                    </label>
                    <input
                      type="number"
                      id="mobile-max-price"
                      min={lowestPrice}
                      max={hightPrice}
                      className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm"
                      value={filter.priceRange[1]}
                      onChange={(e) =>
                        setFilter((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            Number(e.target.value),
                          ],
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Colors
                </h3>
                <div className="space-y-2">all colors</div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Sizes
                </h3>
                <div className="grid grid-cols-4 gap-2">all sizes</div>
              </div>

              {/* Apply button */}
              <div className="mt-6 flex items-center justify-between">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                  Clear all
                </button>
                <button
                  className="bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-black"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
