"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import {
  useDeleteFromCartItemsMutation,
  useGetCartItemsQuery,
  useUpdateCartItemsMutation,
} from "../redux/services/cartApi";
import Loader from "@/app/Loader";
import { useRouter } from "next/navigation";
import { setSummary } from "../redux/features/order_summary_feature/orderSlice";
import { useAppDispatch } from "../redux/hooks/hooks";
// Recommended products
const recommendedProducts = [
  {
    id: 3,
    name: "Casual Chino Pants",
    price: 59.99,
    image: "https://picsum.photos/seed/pants/400",
    rating: 4.2,
    isNew: true,
  },
  {
    id: 4,
    name: "Knit Sweater",
    price: 49.99,
    image: "https://picsum.photos/seed/sweater/400",
    rating: 4.0,
  },
  {
    id: 5,
    name: "Classic Oxford Shirt",
    price: 45.99,
    image: "https://picsum.photos/seed/oxford/400",
    rating: 4.7,
    onSale: true,
    originalPrice: 65.99,
  },
  {
    id: 6,
    name: "Slim Fit Jeans",
    price: 69.99,
    image: "https://picsum.photos/seed/jeans/400",
    rating: 4.9,
  },
];

export default function CartPage() {
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    data: cartItems,
    isSuccess,
    isLoading,
    isError,
  } = useGetCartItemsQuery();

  const [updatingQtyOfProduct] = useUpdateCartItemsMutation();
  const [deletingCartItem] = useDeleteFromCartItemsMutation();

  if (isError) {
    throw new Error("failed fetching cart data");
  }
  // Calculate cart totals
  const subtotal = cartItems?.cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const shippingCost =
    shippingMethod === "express"
      ? 12.99
      : shippingMethod === "standard"
      ? 5.99
      : 0;
  const taxRate = 0.08;
  const taxAmount = (subtotal - promoDiscount) * taxRate;
  const total = subtotal  + shippingCost + taxAmount;

  // Update item quantity
  const updateQuantity = async (
    cartItemId: number,
    productID: number,
    newQty: number
  ) => {
    const item = {
      id: cartItemId,
      productId: productID,
      quantity: newQty,
    };

    await updatingQtyOfProduct(item);
  };

  // Remove item from cart
  const removeItem = async (cartId: number) => {
    const item = {
      id: cartId,
    };
    await deletingCartItem(item);
  };

  // Apply promo code
  // const applyPromoCode = () => {
  //   // Reset previous messages
  //   setPromoError("");
  //   setPromoSuccess("");

  //   // Simple validation
  //   if (!promoCode.trim()) {
  //     setPromoError("Please enter a promo code");
  //     return;
  //   }

  //   // Mock promo code validation
  //   if (promoCode.toUpperCase() === "DISCOUNT20") {
  //     const discount = subtotal * 0.2;
  //     setPromoDiscount(discount);
  //     setPromoSuccess("20% discount applied successfully!");
  //   } else if (promoCode.toUpperCase() === "FREESHIP") {
  //     setShippingMethod("free");
  //     setPromoSuccess("Free shipping applied successfully!");
  //   } else {
  //     setPromoError("Invalid promo code");
  //   }
  // };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const handleContinue = () => {
    const summary = {
      subtotal: subtotal,
      shippingCost: shippingCost,
      tax:taxAmount,
      total: total,
      cartItems:cartItems.cart.items,
    };

    dispatch(setSummary(summary));

    router.push("/shop/cart/checkout");
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Shopping Cart</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Your Shopping Cart
        </h1>

        {isLoading ? (
          <Loader />
        ) : (
          isSuccess &&
          (cartItems.cart.items.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
              <div className="mx-auto w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full mb-6">
                <ShoppingBag className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                href={'/shop/products'}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-black"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Cart Items (
                      {cartItems.cart.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                      )
                    </h2>
                  </div>

                  <ul className="divide-y divide-gray-200">
                    {cartItems.cart.items.map((item) => (
                      <li key={item.id} className="p-6">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product Image */}
                          <div className="flex-shrink-0 sm:mr-6 mb-4 sm:mb-0">
                            <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden border border-gray-200">
                              <Image
                                src={item.product.thumbnail}
                                alt={item.product.name}
                                width={96}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="text-base font-medium text-gray-900">
                                  <Link
                                    href={`/product/${item.id}`}
                                    className="hover:text-gray-700"
                                  >
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <div className="mt-1 flex items-center text-sm text-gray-500">
                                  <span>Color: {item.color}</span>
                                <span className="mx-2">•</span>
                                <span>Size: {item.size}</span>
                                </div>
                                <div className="mt-1 text-sm font-medium text-gray-900">
                                  <div className="flex items-center">
                                    <span>
                                      {formatCurrency(item.product.price)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Quantity and Subtotal */}
                              <div className="mt-4 sm:mt-0">
                                <div className="flex items-center">
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.product.id,
                                        item.quantity - 1
                                      )
                                    }
                                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    className="mx-2 w-12 text-center border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                  />
                                  <button
                                    onClick={() =>
                                      updateQuantity(
                                        item.id,
                                        item.product.id,
                                        item.quantity + 1
                                      )
                                    }
                                    className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="mt-2 text-right">
                                  <span className="text-sm font-medium text-gray-900">
                                    Subtotal:{" "}
                                    {formatCurrency(
                                      item.product.price * item.quantity
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="flex items-center text-sm text-gray-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <Link
                      href="/products"
                      className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                      <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm sticky top-20">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Promo Code */}
                    {/* <div>
                      <label
                        htmlFor="promo-code"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Promo Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          id="promo-code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Enter code"
                        />
                        <button
                          onClick={applyPromoCode}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100"
                        >
                          Apply
                        </button>
                      </div>
                      {promoError && (
                        <p className="mt-1 text-sm text-red-600">
                          {promoError}
                        </p>
                      )}
                      {promoSuccess && (
                        <p className="mt-1 text-sm text-green-600">
                          {promoSuccess}
                        </p>
                      )}
                    </div> */}

                    {/* Shipping Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Method
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value="standard"
                            checked={shippingMethod === "standard"}
                            onChange={() => setShippingMethod("standard")}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                          />
                          <span className="ml-2 flex justify-between w-full">
                            <span className="text-sm text-gray-900">
                              Standard Shipping
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              $5.99
                            </span>
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value="express"
                            checked={shippingMethod === "express"}
                            onChange={() => setShippingMethod("express")}
                            className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                          />
                          <span className="ml-2 flex justify-between w-full">
                            <span className="text-sm text-gray-900">
                              Express Shipping
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              $12.99
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Order Totals */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">Subtotal</p>
                        <p className="text-gray-900 font-medium">
                          {formatCurrency(subtotal)}
                        </p>
                      </div>
                      {promoDiscount > 0 && (
                        <div className="flex justify-between text-sm">
                          <p className="text-gray-500">Discount</p>
                          <p className="text-green-600 font-medium">
                            -{formatCurrency(promoDiscount)}
                          </p>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">Shipping</p>
                        <p className="text-gray-900 font-medium">
                          {formatCurrency(shippingCost)}
                        </p>
                      </div>
                      <div className="flex justify-between text-sm">
                        <p className="text-gray-500">Tax (8%)</p>
                        <p className="text-gray-900 font-medium">
                          {formatCurrency(taxAmount)}
                        </p>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <p className="text-base font-medium text-gray-900">
                          Total
                        </p>
                        <p className="text-base font-medium text-gray-900">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <div className="mt-6">
                      <button
                        onClick={() => handleContinue()}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-black"
                      >
                        Proceed to Checkout
                      </button>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 text-center">
                        Secure checkout powered by Stripe
                      </p>
                      <div className="flex justify-center space-x-2 mt-2">
                        <Image
                          src="/placeholder.svg?height=24&width=38"
                          alt="Visa"
                          width={38}
                          height={24}
                          className="h-6"
                        />
                        <Image
                          src="/placeholder.svg?height=24&width=38"
                          alt="Mastercard"
                          width={38}
                          height={24}
                          className="h-6"
                        />
                        <Image
                          src="/placeholder.svg?height=24&width=38"
                          alt="American Express"
                          width={38}
                          height={24}
                          className="h-6"
                        />
                        <Image
                          src="/placeholder.svg?height=24&width=38"
                          alt="PayPal"
                          width={38}
                          height={24}
                          className="h-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Recommended Products */}
        {/* <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
