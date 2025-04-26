"use client"
import React from "react";
import Products from "./Products";

function BestSeller({ products }: { products: ShopProduct[]}) {
  return <Products product={products}/>;
}

export default BestSeller;
