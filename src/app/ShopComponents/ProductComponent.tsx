"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Edit,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Trash,
  X,
} from "lucide-react";
import { toastingSuccess } from "@/lib/toast_message/toastingSuccess";
import axiosClient from "@/lib/axios/axiosClient";
import { toastingError } from "@/lib/toast_message/toastingErrors";
import Loader from "../Loader";
import { useRouter } from "next/navigation";

type ReviewProduct = {
  score: number;
  review: string;
};

export default function ProductIdPage({ product }: { product: ShopProduct }) {
  const customerId = "e9346d15-b333-4312-85e5-1d090cc6b564";

  const customerCommentExits = product.ratings.find(
    (comment) => comment.customerId === customerId
  );

  const [mainImage, setMainImage] = useState<string>(product.thumbnail);

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0].code
  );

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes[0].code
  );

  const [quantity, setQuantity] = useState({
    increment: 1,
    decrease: 1,
    current: 1,
  });

  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  const [editReviewModalOpen, setEditReviewModalOpen] =
    useState<boolean>(false);

  const [newReview, setNewReview] = useState<ReviewProduct>({
    score: 1,
    review: "",
  });

  const [editingReview, setEditingReview] = useState<ReviewProduct>({
    score: 1,
    review: "",
  });

  const [moreComments, setMoreComments] = useState({
    more: 2,
    less: 2,
    initial: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditingInCommentSection, setIsEditingInCommentSection] =
    useState<boolean>(false);

  const [editingReviewId, setEditingReviewId] = useState<number | undefined>(
    undefined
  );

  const [deleteReviewId, setDeleteReviewId] = useState<number | undefined>(
    undefined
  );

  const disableBtn =
    customerCommentExits?.score === editingReview.score &&
    customerCommentExits?.review === editingReview.review;

  // values of star rating
  const stars = product.ratings.reduce((acc, curr) => acc + curr.score, 0);
  const comments = product.ratings;

  const totalOfReviewers = product.ratings.length;

  const avgRatingScore = stars / totalOfReviewers;

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, score) => {
    acc[score] = product.ratings.filter((r) => r.score === score).length;
    return acc;
  }, {} as Record<number, number>);
  const router = useRouter();
  // functions send to api
  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const creating = await axiosClient.post("product/rateProductMethods", {
        customerId: customerId,
        productId: product.id,
        score: newReview.score,
        review: newReview.review,
      });
      router.refresh();
      handleRestNewReview();
      toastingSuccess(creating);
    } catch (err) {
      toastingError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updating = await axiosClient.patch("product/rateProductMethods", {
        id: editingReviewId,
        customerId: customerId,
        productId: product.id,
        score: editingReview.score,
        review: editingReview.review,
      });
      router.refresh();
      handleRestEditReview();
      toastingSuccess(updating);
    } catch (err) {
      toastingError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async () => {
    setIsLoading(true);
    try {
      const deleting = await axiosClient.delete("product/rateProductMethods", {
        data: {
          id: deleteReviewId,
          customerId: customerId,
          productId: product.id,
        },
      });
      router.refresh();
      setDeleteReviewId(undefined);
      toastingSuccess(deleting);
    } catch (err) {
      toastingError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // helper functions
  const handleEditReview = (selectedReview: Rate) => {
    if (selectedReview.customerId !== customerId) return;
    setEditingReview({
      score: selectedReview.score,
      review: selectedReview.review,
    });

    setEditingReviewId(selectedReview.id);

    setIsEditingInCommentSection(true);
  };

  const handleRestEditReview = () => {
    setEditingReview({
      score: customerCommentExits?.score ?? 1,
      review: customerCommentExits?.review ?? "",
    });

    setEditingReviewId(undefined);

    if (isEditingInCommentSection) return setIsEditingInCommentSection(false);

    if (editReviewModalOpen) return setEditReviewModalOpen(false);
  };

  const handleRestNewReview = () => {
    setNewReview({
      ...newReview,
      score: 1,
      review: "",
    });
    setReviewModalOpen(false);
  };

  useEffect(() => {
    if (customerCommentExits?.id !== undefined) {
      setEditingReviewId(customerCommentExits.id);
    }
    if (
      customerCommentExits?.score !== undefined &&
      customerCommentExits?.review !== undefined
    ) {
      setEditingReview({
        score: customerCommentExits.score,
        review: customerCommentExits.review,
      });
    }
  }, [customerCommentExits]);

  return (
    <div className="bg-white">
      {product && (
        <div className=" px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-gray-900">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={mainImage}
                  alt={"img"}
                  width={600}
                  height={600}
                  className="h-full w-full object-contain"
                />
              </div>
              {/* <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage("df")}
                  className={`aspect-square rounded-md overflow-hidden border-2 ${"border-gray-200"}`}
                >
                  <Image
                    src={CarImage}
                    alt={`dsgd`}
                    width={150}
                    height={150}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div> */}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* {product.isNew && (
              <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3 self-start">
                NEW
              </div>
            )} */}
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {product.name}
              </h1>

              {product.ratings.length > 0 && (
                <div className="flex items-center mt-2 mb-4">
                  <div className="flex items-center">
                    {product.ratings.map((star, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < star.score
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {avgRatingScore.toFixed(1)} ({totalOfReviewers} reviews)
                    </span>
                  </div>
                </div>
              )}

              <div className="text-2xl font-bold text-gray-900 mt-2">
                ${product.price}
              </div>

              <div className="mt-6 space-y-6">
                {/* Color selector */}

                <div>
                  <h3 className="text-sm font-medium text-gray-900">Color</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {product.colors.map((color) => (
                      <button
                        style={{ background: color.code }}
                        key={color.id}
                        className={`relative w-8 h-8 rounded-full  ${
                          selectedColor === color.code
                            ? "ring-2 ring-offset-2 ring-gray-800"
                            : ""
                        }`}
                        onClick={() => setSelectedColor(color.code)}
                        title={color.name}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Size selector */}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Size</h3>
                    <button className="text-sm font-medium text-gray-600 hover:text-gray-900">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.id}
                        className={`py-2 px-3 text-sm font-medium rounded-md border ${
                          selectedSize === size.code
                            ? "bg-gray-900 text-white border-gray-900"
                            : "border-gray-300 text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => setSelectedSize(size.code)}
                      >
                        {size.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity selector */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Quantity
                  </h3>
                  <div className="flex items-center mt-2 border border-gray-300 rounded-md w-32">
                    <button
                      disabled={quantity.current === 1}
                      onClick={() =>
                        setQuantity((prev) => ({
                          ...prev,
                          current: prev.current - prev.decrease,
                        }))
                      }
                      type="button"
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-center flex-1">
                      {quantity.current}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((prev) => ({
                          ...prev,
                          current: prev.current + prev.increment,
                        }))
                      }
                      type="button"
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Product details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Details</h3>
                  <p className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {product.description}
                  </p>
                </div>

                {/* Add to cart and wishlist */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                  <button className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-black flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-900 py-3 px-4 rounded-md font-medium hover:bg-gray-50 flex items-center justify-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Add to Wishlist
                  </button>
                </div>

                {/* Share */}
                <div className="flex items-center pt-2">
                  <Share2 className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    Share
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 border-t border-gray-200 pt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              {!customerCommentExits ? (
                <button
                  disabled={isLoading}
                  onClick={() => setReviewModalOpen(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
                >
                  Write a Review
                </button>
              ) : (
                <button
                  disabled={isLoading}
                  onClick={() => (
                    setEditReviewModalOpen(true),
                    setEditingReviewId(customerCommentExits.id)
                  )}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black transition-colors"
                >
                  Edit The Review
                </button>
              )}
            </div>

            {isLoading ? (
              <Loader />
            ) : (
              <>
                {/* Review Stats */}
                <div className="mb-8">
                  <div className="bg-gray-50 p-6 rounded-lg max-w-md">
                    <div className="flex items-center mb-4">
                      <span className="text-4xl font-bold text-gray-900 mr-2">
                        {Number.isNaN(avgRatingScore) ? 0 : avgRatingScore.toFixed(1)}
                      </span>
                      <div className="flex flex-col">
                        <div className="flex">
                          {product.ratings.map((star, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(star.score)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          Based on {totalOfReviewers} reviews
                        </span>
                      </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star] || 0;
                        const percentage =
                          totalOfReviewers > 0
                            ? Math.round((count / totalOfReviewers) * 100)
                            : 0;

                        return (
                          <div key={star} className="flex items-center">
                            <div className="flex items-center w-24">
                              <span className="text-sm text-gray-600 mr-2">
                                {star}
                              </span>
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            </div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 ml-2 w-12">
                              {percentage}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {comments
                    .slice(moreComments.initial, moreComments.more)
                    .map((reviews, i) => (
                      <div key={i} className="border-b border-gray-200 pb-6">
                        {customerId === reviews.customerId &&
                        editingReviewId === reviews.id &&
                        isEditingInCommentSection ? (
                          // Edit review form
                          <form onSubmit={updateReview} className="space-y-4">
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-900">
                                Edit Your Review
                              </h3>
                              <button
                                type="button"
                                onClick={() => handleRestEditReview()}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                              </label>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      setEditingReview({
                                        ...editingReview,
                                        score: star,
                                      })
                                    }
                                    className="p-1 focus:outline-none"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        star <= editingReview.score
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="edit-review-comment"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Your Review
                              </label>
                              <textarea
                                id="edit-review-comment"
                                rows={4}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                                value={editingReview.review}
                                onChange={(e) =>
                                  setEditingReview({
                                    ...editingReview,
                                    review: e.target.value,
                                  })
                                }
                                required
                              ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <button
                                type="button"
                                onClick={() => handleRestEditReview()}
                                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={disableBtn}
                                className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                              >
                                Update Review
                              </button>
                            </div>
                          </form>
                        ) : (
                          // Review display
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="flex mr-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < reviews.score
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {reviews.customer.name}
                                </span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(reviews.createdAt).toLocaleString()}
                                </span>
                              </div>

                              {customerId === reviews.customerId && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditReview(reviews)}
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    aria-label="Edit review"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      setDeleteReviewId(reviews.id)
                                    }
                                    className="text-gray-400 hover:text-red-500 p-1"
                                    aria-label="Delete review"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600">{reviews.review}</p>

                            {/* Delete confirmation */}
                            {deleteReviewId === reviews.id && (
                              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-md">
                                <p className="text-sm text-red-800 mb-2">
                                  Are you sure you want to delete this review?
                                </p>
                                <div className="flex justify-end space-x-2">
                                  <button
                                    onClick={() => setDeleteReviewId(undefined)}
                                    className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => deleteReview()}
                                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                </div>

                {/* Load More Reviews Button */}
                <div className="mt-8 text-center">
                  <div className="mt-8 text-center">
                    {comments.length > 0 && (
                      <>
                        {moreComments.more < comments.length ? (
                          <button
                            onClick={() =>
                              setMoreComments((prev) => ({
                                ...prev,
                                more: prev.more + 2,
                              }))
                            }
                            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Show More Reviews
                          </button>
                        ) : (
                          moreComments.more > 2 && (
                            <button
                              onClick={() =>
                                setMoreComments((prev) => ({
                                  ...prev,
                                  more: Math.max(2, prev.more - prev.less), // Ensure `more` never goes below 2
                                }))
                              }
                              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              Less Reviews
                            </button>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {/* <RelatedProducts categoryId={product.category.id.toString()} /> */}
            </div>
          </div>

          {/* Review Modal */}

          {reviewModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 bg-gray-500 opacity-75"
                    onClick={() => handleRestNewReview()}
                  ></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">
                        Write a Review
                      </h3>
                      <button
                        onClick={() => handleRestNewReview()}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <form onSubmit={submitReview} className="mt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setNewReview({ ...newReview, score: star })
                              }
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= newReview.score
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="review-comment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="review-comment"
                          rows={4}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Share your experience with this product..."
                          value={newReview.review}
                          onChange={(e) =>
                            setNewReview({
                              ...newReview,
                              review: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>

                      <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => handleRestNewReview()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                        >
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {editReviewModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 bg-gray-500 opacity-75"
                    onClick={() => handleRestEditReview()}
                  ></div>
                </div>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">
                        Write a Review
                      </h3>
                      <button
                        onClick={() => handleRestEditReview()}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {/* Edit review form */}
                    <form onSubmit={updateReview} className="mt-4">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setEditingReview({
                                  ...editingReview,
                                  score: star,
                                })
                              }
                              className="p-1 focus:outline-none"
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  star <= editingReview.score
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="review-comment"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Your Review
                        </label>
                        <textarea
                          id="review-comment"
                          rows={4}
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Share your experience with this product..."
                          value={editingReview.review}
                          onChange={(e) =>
                            setEditingReview({
                              ...editingReview,
                              review: e.target.value,
                            })
                          }
                          required
                        ></textarea>
                      </div>

                      <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => handleRestEditReview()}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={disableBtn}
                          className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-black"
                        >
                          Update Review
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
