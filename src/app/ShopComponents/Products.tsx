"use client";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Heart } from "lucide-react";
import { IsCustomerAuthed } from "@/lib/utils";
import { useGetCustomerInfoQuery } from "../shop/redux/services/customerInfoApi";
import { useAddToCartItemsMutation } from "../shop/redux/services/cartApi";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import {
  useAddToWishlistItemMutation,
  useDeleteWishlistItemMutation,
} from "../shop/redux/services/wishlistApi";
import { useRouter } from "next/navigation";
import { toastingInfo } from "@/lib/toast_message/toastingInfo";
import { useEffect, useState } from "react";

function Products({ product }: { product: ShopProduct[] }) {
  const [wishlistMap, setWishlistMap] = useState<{
    [productId: number]: boolean;
  }>({});
  const isAuthed = IsCustomerAuthed();
  const router = useRouter();

  const {
    data: customerInfo,
    isError: isCustomerInfoError,
  } = useGetCustomerInfoQuery(undefined, {
    skip: !isAuthed,
  });

  const [addToCart] = useAddToCartItemsMutation();
  const [removeWishListItem] = useDeleteWishlistItemMutation();
  const [addToWishlistItem] = useAddToWishlistItemMutation();

  const addingToCart = async (item: ShopProduct) => {
    if (!isAuthed || !customerInfo) {
      toastingInfo("Please Login to add to cart", router);
      return;
    }

    const product = {
      productId: item.id,
      quantity: item.qty,
      size: item.sizes[0].code,
      color: item.colors[0].code,
    };

    const res = await addToCart(product);

    if (res.data) {
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const addingToWishlist = async (itemId: number) => {
    if (!isAuthed || !customerInfo) {
      toastingInfo("Please Login to add to Favorite", router);
      return;
    }
    const item = {
      productId: itemId,
      customerId: customerInfo.user.id,
    };

    const res = await addToWishlistItem(item);

    if (res.data) {
      setWishlistMap((prev) => ({ ...prev, [itemId]: true }));
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  const removeFromWishList = async (itemId: number) => {
    if (!isAuthed || !customerInfo) {
      toastingInfo("Please Login to remove from Favorite", router);
      return;
    }
    const item = {
      productId: itemId,
      customerId: customerInfo.user.id,
    };
    const res = await removeWishListItem(item);
    if (res.data) {
      setWishlistMap((prev) => ({ ...prev, [itemId]: false }));
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  useEffect(() => {
    if (customerInfo) {
      const map: { [productId: number]: boolean } = {};
      product.forEach((item) => {
        map[item.id] = item.wishlist.some(
          (i) =>
            i.customerId === customerInfo.user.id && i.productId === item.id
        );
      });
      setWishlistMap(map);
    }
  }, [customerInfo, product]);

  if (!product || product.length === 0) {
    return <div>No product available</div>;
  }

  if (isCustomerInfoError) {
    toastingInfo("Please Login", router);
    return;
  }

  return (
    <>
      {product.map((item) => {
        const scores = item.ratings.map((r) => r.score);
        const total = scores.reduce((acc, score) => acc + score, 0);
        const avgRatingScore = scores.length ? total / scores.length : 0;

        return (
          <div
            key={item.id}
            className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1 max-w-[400px] duration-300"
          >
            {/* Wishlist button */}
            <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              {wishlistMap[item.id] ? (
                <button
                  onClick={() => removeFromWishList(item.id)}
                  className="rounded-full hover:cursor-pointer bg-white p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart fill="red" className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={() => addingToWishlist(item.id)}
                  className="rounded-full hover:cursor-pointer bg-white p-1.5 shadow-md hover:bg-gray-100 transition-colors"
                >
                  <Heart fill="white" className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Product image */}
            <Link href={`/shop/product/${item.id}`}>
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
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill={
                        i < Math.floor(avgRatingScore) ? "currentColor" : "none"
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
              </div>

              {/* Product name */}
              <h3 className="text-sm font-semibold line-clamp-1 text-gray-900">
                {item.name}
              </h3>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <p className="text-sm font-bold text-gray-900">${item.price}</p>
              </div>

              {/* Add to cart button */}
              <button
                onClick={() => addingToCart(item)}
                className="w-full flex items-center justify-center rounded-md bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <ShoppingCart /> Add to Cart
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Products;
