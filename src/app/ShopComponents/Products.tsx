import axios from 'axios';
import React from 'react'

async function FetchData () {
  try {
    const res = await axios.get("/api/shop/product/productMethods");
    return res.data.products;
  }catch(err) {
    throw new Error(`Failed Fetching Products: ${err}`)
  }
};

function Products() {
  // const product = await FetchData();
  return (
    <div className="flex flex-col max-w-[262px]">
      <div className="flex flex-col w-full text-base font-bold leading-none text-center uppercase whitespace-nowrap text-neutral-900">
        <div className="flex rounded-md relative flex-col items-start px-4 pt-4 pb-80 w-full aspect-[0.751]">
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/969110fba45f3ac8dc379f3bddb455b9bb15ebf3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
            className="object-cover absolute inset-0 size-full rounded-md"
          />
          <div className="flex relative flex-col mb-0">
            <div className="gap-2 self-stretch px-3.5 py-1 bg-white rounded">
              NEW
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-3 w-full font-semibold">
        <div className="flex flex-col items-start w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/1556cbdb003e44ba64493fe6c76b329ad26a011f?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
            className="object-contain aspect-[5.49] w-[88px]"
          />
          <div className="self-stretch mt-1 text-base leading-7 text-neutral-900">
            Paradigm Chilliwack Black Label Jacket
          </div>
          <div className="gap-3 mt-1 text-sm leading-loose whitespace-nowrap text-neutral-900">
            $349.99
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products