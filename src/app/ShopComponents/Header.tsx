import React from "react";
import {
  ArrowDownIcon,
  CartIcon,
  ProfileIcon,
  SearchIcon,
} from "../../../public/svg/icons";

function Header() {
  return (
    <header className="flex items-center justify-between w-full bg-[#F8F9FA] px-40 py-4">
      {/* Left: Logo */}
      <div className="flex items-center text-2xl font-medium text-black">
        <span>Max</span>
        <span className="text-zinc-500">.</span>
      </div>

      {/* Center: Navigation */}
      <nav className="flex gap-10 max-md:gap-5 max-sm:hidden">
        <button className="text-sm font-medium text-neutral-900 hover:cursor-pointer">
          Home
        </button>
        <div className="flex items-center gap-1 text-sm font-medium text-neutral-900">
          <button className="hover:cursor-pointer">Product</button>
          <ArrowDownIcon />
        </div>
        {/* <p className="text-sm font-medium text-neutral-900">Contact Us</p> */}
      </nav>

      {/* Right: Search, Cart, Profile */}
      <div className="flex items-center gap-4 max-sm:gap-2.5">
        <button className="hover:cursor-pointer">
          <SearchIcon />
        </button>
        <button className="hover:cursor-pointer">
          <CartIcon />
        </button>
        <button className="hover:cursor-pointer">
          <ProfileIcon />
        </button>
      </div>
    </header>
  );
}

export default Header;
