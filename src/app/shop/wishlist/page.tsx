"use client";
import {  useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { useRouter } from "next/navigation";
import {
  useDeleteWishlistItemMutation,
  useGetWishlistQuery,
} from "../redux/services/wishlistApi";
import Loader from "@/app/Loader";
import { useAddToCartItemsMutation } from "../redux/services/cartApi";
import { useGetCustomerInfoQuery } from "../redux/services/customerInfoApi";

export default function WishlistPage() {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(
    null
  );
  const router = useRouter();

  const [addToCart] = useAddToCartItemsMutation();

  const [deleteFromWishList] = useDeleteWishlistItemMutation();

  const moveToCart = async (item: ShopProduct) => {

    const product = {
      productId: item.id,
      quantity: item.qty,
      total: item.price * item.qty,
    };

    const res = await addToCart(product);

    if (res.data) {
      toastingSuccess(res.data.message, router.refresh);
    } else {
      toastingSuccess(res.error);
    }

  };

    const {
    data: customerInfo,
    isError: isCustomerInfoError,
  } = useGetCustomerInfoQuery();

  if (isCustomerInfoError) {
    throw new Error("Failed Getting Customer Info");
  }

  const { data, isLoading, isSuccess, isError } = useGetWishlistQuery();

  let wishlistItems: WishlistItems[] = [];

  if (isSuccess) {
    wishlistItems = data.wishlistItems;
  } else {
    wishlistItems = [];
  }

  if (isError) {
    throw new Error("Failed to fetch Wishlist");
  }

  const removeFromWishList = async (itemId: number) => {
    const item = {
      productId: itemId,
      customerId: customerInfo?.user.id,
    };
    const res = await deleteFromWishList(item);

    if (res.data) {
      toastingSuccess(res.data.message, router.refresh);
    } else {
      toastingError(res.error);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Wishlist</span>
        </nav>

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Wishlist
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Items you've saved for later. Add them to your cart when you're
              ready to purchase.
            </p>
          </div>
        </div>

        {/* Wishlist content */}
        {isLoading ? (
          <Loader />
        ) : (
          isSuccess &&
          (wishlistItems.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <Heart className="h-12 w-12 mx-auto text-gray-400" />
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Browse our products and add your favorites to your wishlist.
              </p>
              <div className="mt-6">
                <Link
                  href="/shop/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems
                .map((p) => p.product)
                .map((item) => (
                  <div
                    key={item.id}
                    className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => setShowRemoveConfirm(item.id)}
                      className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-gray-700 hover:text-red-500" />
                    </button>

                    {/* Product image */}
                    <Link
                      href={`/product/${item.id}`}
                      className="block overflow-hidden"
                    >
                      <div className="overflow-hidden bg-gray-50">
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          width={400}
                          height={400}
                          className="h-[300px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    {/* Product details */}
                    <div className="p-4">
                      {/* Product name */}
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-base font-medium line-clamp-1 mb-1 hover:text-gray-700">
                          {item.name}
                        </h3>
                      </Link>

                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="text-base font-bold">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Add to cart button */}
                      <button
                        onClick={() => moveToCart(item)}
                        className="w-full flex items-center justify-center bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-black transition-colors"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </button>
                    </div>

                    {/* Remove confirmation */}
                    {showRemoveConfirm === item.id && (
                      <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4 z-20">
                        <p className="text-center font-medium mb-4">
                          Remove this item from your wishlist?
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setShowRemoveConfirm(null)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => removeFromWishList(item.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
