// import axios from "axios";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Tshirt  from "../../../public/00722745420-e1.jpg";

function ShopByCategories({ categories }: { categories: ShopCategory[] }) {
  return categories.map((cate) => (
    <Link
      key={cate.id}
      href={`shop/${cate.id}`}
      className="flex flex-col items-center group"
    >
      <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-gray-200 mb-2 group-hover:border-gray-900 transition-colors">
        <Image src={Tshirt} alt="dsf" fill className="object-cover" />
      </div>
      <span className="text-sm font-medium text-center">{cate.name}</span>
    </Link>
  ));
}

export default ShopByCategories;
