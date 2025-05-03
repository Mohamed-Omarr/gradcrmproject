import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Heart } from "lucide-react";
function Products({ product }: { product: ShopProduct[] }) {
  if (!product || product.length === 0) {
    return <div>No product available</div>;
  }

  return (
    <>
      {product.map((item) => (
        <div
          key={item.id}
          className="group relative rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-1 max-w-[400px] duration-300"
        >
          {/* Wishlist button */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="rounded-full bg-white p-1.5 shadow-md hover:bg-gray-100 transition-colors">
              {/* Heart icon */}
              <Heart />
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
                className="h-[330px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Product details */}
          <div className="p-4 space-y-2">
            {/* Rating */}
            {/* <div className="flex items-center space-x-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="text-yellow-400"/>
              ))}
              <span className="ml-1 text-xs text-gray-600">rating</span>
            </div> */}

            {/* Product name */}
            <h3 className="text-sm font-semibold line-clamp-1 text-gray-900">
              {item.name}
            </h3>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <p className="text-sm font-bold text-gray-900">${item.price}</p>
            </div>

            {/* Add to cart button */}
            <button className="w-full flex items-center justify-center rounded-md bg-gray-900 py-2 text-xs font-semibold text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-300">
              <ShoppingCart  /> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

export default Products;
