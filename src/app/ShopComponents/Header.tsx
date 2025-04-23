import React from "react";
import {
  ArrowDownIcon,
  CartIcon,
  ProfileIcon,
  SearchIcon,
} from "../../../public/svg/icons";

function Header() {
  return (
    <header className="flex items-centerw-full bg-white bg-opacity-0">
      <div className="flex items-center text-2xl font-medium text-black">
        <span>Max</span>
        <span className="text-zinc-500">.</span>
      </div>
      <div className="flex gap-10 max-md:gap-5 max-sm:hidden">
        <div className="flex items-center text-sm font-medium text-neutral-900 max-md:text-sm">
          <p className="text-sm font-medium text-neutral-900 max-md:text-sm">
            Home
          </p>
        </div>
        <div className="flex items-center text-sm font-medium text-neutral-900 max-md:text-sm">
          <p>Product</p>
          <div>
            <ArrowDownIcon />
          </div>
          <p className="text-sm font-medium text-neutral-900 max-md:text-sm">
            Contact Us
          </p>
        </div>
        <div className="flex gap-4 items-center max-sm:gap-2.5">
          <SearchIcon />
        </div>
        <div className="flex relative items-center">
          <div>
            <ProfileIcon />
            <div>
              <CartIcon />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
