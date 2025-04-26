"use client"
import React from "react";
import Products from "./Products";

function NewArrivals({ products }: { products: ShopProduct[] }) {
  return <Products product={products}/>;
}

export default NewArrivals;
