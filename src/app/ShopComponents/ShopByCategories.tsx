// import axios from "axios";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import CarImage from "../../../public/Forza-Horizon-5-Release-Date-How-to-pre-order-Download-Size-Everything-you-must-know.jpg";

// async function FetchData() {
//   try {
//     const res = await axios.get("/api/shop/product/categoryMethods");
//     return res.data.categories;
//   } catch (err) {
//     throw new Error(`Failed Fetching Products: ${err}`);
//   }
// }

async function ShopByCategories() {
  // const category = await FetchData();
  return (
    <Link
      href={`/1`}
      className="flex flex-col items-center group"
    >
      <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-2 group-hover:border-gray-900 transition-colors">
        <Image
          src={CarImage}
          alt="dsf"
          fill
          className="object-cover"
        />
      </div>
      <span className="text-sm font-medium text-center">name</span>
    </Link>
  );
}

export default ShopByCategories;
