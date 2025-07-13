import { Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import React from "react";
import Tshirt from "../../../public/00722745420-e1.jpg";

import Link from "next/link";

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="px-40 flex h-16 items-center">
        <Link href="/home" className="mr-6 flex items-center space-x-2">
          <Image
            src={Tshirt}
            alt="Logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <span className="hidden font-bold sm:inline-block">FashionHub</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mr-4">
          <Link
            href="/home"
            className="text-sm font-medium transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/shop/products"
            className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            Shop
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-end space-x-4">
          <div className="relative hidden md:flex w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search for clothing..."
              className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-4 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300 md:w-[300px] lg:w-[300px]"
            />
          </div>
          <Link href="/shop/cart" className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
            <ShoppingCart className="h-5 w-5" />
            {/* <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-900 text-[10px] font-medium text-white flex items-center justify-center">
              3
            </span> */}
          </Link>
          <Link
            href="/settings/profile"
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
