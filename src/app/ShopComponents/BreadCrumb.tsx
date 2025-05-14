"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

function BreadCrumb() {
    const pathName = usePathname();
    console.log(pathName);
    
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8">
      <Link href="/" className="hover:text-gray-900">
        Home
      </Link>
      <span className="mx-2">/</span>
      <Link href="/products" className="hover:text-gray-900">
        Shop
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-900 font-medium"></span>
    </nav>
  );
}

export default BreadCrumb;
