"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import Products from "@/app/ShopComponents/Products";
import CarImage from "../../../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";

// Mock product data - in a real app, this would come from an API or database
const getProductById = (id: string) => {
  const products = [
    {
      id: "1",
      name: "Slim Fit Cotton T-Shirt",
      price: 29.99,
      description:
        "This premium slim-fit t-shirt is crafted from 100% organic cotton for exceptional comfort and durability. The modern cut offers a flattering silhouette while maintaining ease of movement. Perfect for everyday wear, this versatile piece can be dressed up or down for any occasion.",
      images: [
        "https://picsum.photos/seed/tshirt1/600",
        "https://picsum.photos/seed/tshirt2/600",
        "https://picsum.photos/seed/tshirt3/600",
        "https://picsum.photos/seed/tshirt4/600",
      ],
      rating: 4.5,
      reviewCount: 127,
      isNew: true,
      colors: ["Black", "White", "Navy", "Gray"],
      sizes: ["XS", "S", "M", "L", "XL"],
      details: [
        "100% organic cotton",
        "Machine washable",
        "Regular fit",
        "Crew neck",
        "Short sleeves",
      ],
    },
    {
      id: "2",
      name: "Relaxed Denim Jacket",
      price: 89.99,
      description:
        "Our relaxed denim jacket combines timeless style with modern comfort. Made from premium denim with a touch of stretch, this jacket features a classic silhouette with a slightly oversized fit. Perfect for layering in any season, it's a versatile addition to your wardrobe that will only get better with age.",
      images: [
        "https://picsum.photos/seed/jacket1/600",
        "https://picsum.photos/seed/jacket2/600",
        "https://picsum.photos/seed/jacket3/600",
        "https://picsum.photos/seed/jacket4/600",
      ],
      rating: 4.8,
      reviewCount: 94,
      isNew: true,
      colors: ["Blue", "Black", "Light Blue"],
      sizes: ["S", "M", "L", "XL"],
      details: [
        "98% cotton, 2% elastane",
        "Button closure",
        "Machine washable",
        "Relaxed fit",
        "Multiple pockets",
      ],
    },
  ];

  return products.find((product) => product.id === id) || products[0];
};

// Related products
const relatedProducts = [
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProductById("1");
  const [mainImage, setMainImage] = useState(CarImage);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[2]); // Default to M
  const [quantity, setQuantity] = useState(1);

  // Function to get color class based on color name
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      Black: "bg-black",
      White: "bg-white border border-gray-300",
      Navy: "bg-blue-900",
      Blue: "bg-blue-600",
      Gray: "bg-gray-500",
      "Light Blue": "bg-blue-300",
    };
    return colorMap[color] || "bg-gray-500";
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <div className="bg-white">
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
                src={CarImage}
                alt={"img"}
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
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
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.isNew && (
              <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded mb-3 self-start">
                NEW
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>

            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-2xl font-bold text-gray-900 mt-2">
              ${product.price.toFixed(2)}
            </div>

            <p className="mt-4 text-gray-600">{product.description}</p>

            <div className="mt-6 space-y-6">
              {/* Color selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Color</h3>
                <div className="flex items-center space-x-3 mt-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`relative w-8 h-8 rounded-full ${getColorClass(
                        color
                      )} ${
                        selectedColor === color
                          ? "ring-2 ring-offset-2 ring-gray-800"
                          : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      <span className="sr-only">{color}</span>
                    </button>
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
                      key={size}
                      className={`py-2 px-3 text-sm font-medium rounded-md border ${
                        selectedSize === size
                          ? "bg-gray-900 text-white border-gray-900"
                          : "border-gray-300 text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="flex items-center mt-2 border border-gray-300 rounded-md w-32">
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={decrementQuantity}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-center flex-1">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="p-2 text-gray-600 hover:text-gray-900"
                    onClick={incrementQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product details */}
              <div>
                <h3 className="text-sm font-medium text-gray-900">Details</h3>
                <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {product.details.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
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
                <span className="text-sm font-medium text-gray-900">Share</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            You may also like
          </h2>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {relatedProducts.map((products) => (
              <Products product={products} key={products.id} />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}
