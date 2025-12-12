"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Lock, X } from "lucide-react";
import { useAppSelector } from "../../redux/hooks/hooks";
import {
  useAddAddressMutation,
  useGetAddressQuery,
} from "../../redux/services/addressApi";
import Loader from "@/app/Loader";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import { useGetCardQuery } from "../../redux/services/cardApi";
import axiosClient from "@/lib/axios/axiosClient";
import { useGetCustomerInfoQuery } from "../../redux/services/customerInfoApi";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [showNewAddressModal, setShowNewAddressModal] = useState(false);
  const [newAddressData, setNewAddressData] = useState({
    id: 0,
    type: "Home",
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const router = useRouter();
  
  const {
    data: savedCreditCards,
    isLoading: isLoadingGetCard,
    isSuccess: isSuccessGetCard,
  } = useGetCardQuery();

  const [selectedCreditCard, setSelectedCreditCard] = useState(
    savedCreditCards?.all_Card[0]
  );

  const [shippingAddress, setShippingAddress] = useState<number | undefined>(
    undefined
  );

  const { data: customerInfo, isError: isCustomerInfoError } =
    useGetCustomerInfoQuery();

  if (isCustomerInfoError) {
    throw new Error("Failed Getting Customer Info");
  }
  const {
    data: savedAddresses,
    isLoading: isLoadingGetAddress,
    isSuccess: isSuccessGetAddress,
    isError,
  } = useGetAddressQuery();

  const [creatingAddress, { isLoading: isLoadingCreatingAddress }] =
    useAddAddressMutation();

  const isAnyAddressLoading = isLoadingGetAddress || isLoadingCreatingAddress;

  const summary: OrderSummary | null = useAppSelector(
    (state) => state.order.summary
  );

  useEffect(() => {
    if (isSuccessGetAddress && savedAddresses.all_Address.length > 0) {
      setShippingAddress(savedAddresses.all_Address[0].id);
    }
  }, [isSuccessGetAddress, savedAddresses]);

  if (isError) {
    return "failed to get address";
  }

  if (!summary || summary === null) {
    return console.log("error order summary");
  }

  // Calculate order totals
  const subtotal = summary.cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shippingCost = summary.shippingCost;
  const taxAmount = summary.tax;
  const total = summary.total;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  // Handle new address input changes
  const handleNewAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewAddressData({
      ...newAddressData,
      [name]: value,
    });
  };

  // Handle adding new address
  const handleAddNewAddress = async () => {
    const isDefault = savedAddresses?.all_Address.length === 0;

    const addressToAdd = {
      customerId: customerInfo?.user.id,
      addressType: newAddressData.type,
      street: newAddressData.street,
      city: newAddressData.city,
      country: newAddressData.country,
      zipCode: newAddressData.zipCode,
      default: isDefault,
    };

    const res = await creatingAddress(addressToAdd);
    if (res.data) {
      setShowNewAddressModal(false);
      toastingSuccess(res.data.message);
    } else {
      toastingError(res.error);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } 
  };

  const handleSubmitPayment = async () => {
    try {
      const res = await axiosClient.post("payment/stripe/checkout", {
        amount: Math.round(total * 100), // $25.00
        cardId: selectedCreditCard?.id,
      });
      toastingSuccess("Payment successful!");
      handlePaymentSuccess(res.data.paymentIntent.id);
    } catch (err) {
      toastingError(`Payment failed. Please try again, ${err}`);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: string) => {
    if (!customerInfo ) {
      console.log("No customer ID found");
    }
    const item: CreateOrderPayload = {
      stripePaymentIntentId: paymentIntent,
      customerId: customerInfo.user.id,
      total: Math.round(total * 100), // in cents
      currency: "usd",
      orderItem: summary.cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.thumbnail,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
    };

    const res = await axiosClient.post("payment/order/orderMethods", item);
    if (res.data.message) {
      toastingSuccess("Order placed successfully!", () =>router.push("/settings/profile"));
      localStorage.removeItem("orderSummary");
    } else {
      toastingError(`Failed to create order: ${res.data.error}`);
    }
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
          <Link href="/cart" className="hover:text-gray-900">
            Cart
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Checkout</span>
        </nav>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 1
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <div
              className={`w-8 h-1 ${step >= 2 ? "bg-gray-900" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step >= 2
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {step === 1 ? (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Shipping Information
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Saved Addresses */}
                    <h3 className="text-sm font-medium text-gray-900 mb-3">
                      Saved Addresses
                    </h3>
                    {isAnyAddressLoading ? (
                      <Loader />
                    ) : (
                      isSuccessGetAddress &&
                      savedAddresses.all_Address.length > 0 && (
                        <div className="mb-6">
                          <div className="space-y-3">
                            {savedAddresses.all_Address.map((address) => (
                              <label
                                key={address.id}
                                className={`block border rounded-lg p-4 cursor-pointer ${
                                  shippingAddress === address.id
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="shipping-address"
                                    checked={address.default}
                                    onChange={() =>
                                      setShippingAddress(address.id)
                                    }
                                    className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                                  />
                                  <div className="ml-3">
                                    <span className="block text-sm font-medium text-gray-900">
                                      {address.addressType}{" "}
                                      {address.default && (
                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                          Default
                                        </span>
                                      )}
                                    </span>
                                    <span className="block text-sm text-gray-500 mt-1">
                                      {address.addressType}
                                    </span>
                                    <span className="block text-sm text-gray-500">
                                      {address.street}
                                    </span>
                                    <span className="block text-sm text-gray-500">
                                      {address.city}, {address.zipCode}
                                    </span>
                                    <span className="block text-sm text-gray-500">
                                      {address.country}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    )}

                    {/* Add New Address Button */}
                    <div className="mb-6">
                      <button
                        disabled={isAnyAddressLoading}
                        type="button"
                        onClick={() => setShowNewAddressModal(true)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        + Add a new address
                      </button>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Link
                        href="/cart"
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Cart
                      </Link>
                      <button
                        type="submit"
                        className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-black"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Payment Methods */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Payment Method
                      </h3>

                      {/* Saved Credit Cards */}
                      {isLoadingGetCard ? (
                        <Loader />
                      ) : !isSuccessGetCard ? (
                        <p>No Card</p>
                      ) : savedCreditCards.all_Card.length > 0 ? (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Saved Cards
                          </h4>
                          <div className="space-y-3">
                            {savedCreditCards.all_Card.map((card) => (
                              <label
                                key={card.id}
                                className={`block border rounded-lg p-4 cursor-pointer ${
                                  selectedCreditCard?.id === card.id
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="credit-card"
                                    checked={selectedCreditCard?.id === card.id}
                                    onChange={() => setSelectedCreditCard(card)}
                                    className="h-4 w-4 text-gray-900 focus:ring-gray-500"
                                  />
                                  <div className="ml-3 flex-1">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-900">
                                          {card.brand} •••• {card.last4}
                                        </span>
                                        {card.isDefault && (
                                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Default
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {card.expiryMonth}/{card.expiryYear}
                                      </div>
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                      {card.holderName}
                                    </div>
                                  </div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex items-center mb-6">
                      <Lock className="h-5 w-5 text-gray-400 mr-2" />
                      <p className="text-sm text-gray-500">
                        Your payment information is secure. We use SSL
                        encryption to keep your data safe.
                      </p>
                    </div>

                    <div className="flex justify-between mt-8">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Shipping
                      </button>
                      <button
                        onClick={() => handleSubmitPayment()}
                        type="submit"
                        className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-900 hover:bg-black"
                      >
                        Place Order
                      </button>
                    </div>
                  </form>
                </div>
              )}
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

              <div className="p-6">
                {/* Order Items */}
                <ul className="divide-y divide-gray-200 mb-6">
                  {summary.cartItems.map((item) => (
                    <li key={item.id} className="py-3 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                        <Image
                          src={item.product.thumbnail || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(item.product.price * item.quantity)}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>
                            {item.color} / {item.size}
                          </span>
                          <span className="mx-2">•</span>
                          <span>Qty {item.quantity}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-500">Subtotal</p>
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(subtotal)}
                    </p>
                  </div>
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
                    <p className="text-base font-medium text-gray-900">Total</p>
                    <p className="text-base font-medium text-gray-900">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Address Modal */}
      {showNewAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowNewAddressModal(false)}
              ></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Add New Address
                  </h3>
                  <button
                    onClick={() => setShowNewAddressModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Type
                      </label>
                      <select
                        name="type"
                        value={newAddressData.type}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                      >
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={newAddressData.street}
                      onChange={handleNewAddressChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={newAddressData.city}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={newAddressData.zipCode}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={newAddressData.country}
                        onChange={handleNewAddressChange}
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowNewAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                    onClick={handleAddNewAddress}
                  >
                    Add Address
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
