import React from "react";

function ShopByCategories() {
  return (
    <div className="flex flex-col items-start py-12 pl-40 max-md:pl-5">
      <div className="gap-10 self-stretch max-w-full text-4xl font-medium tracking-tight leading-none text-zinc-800 w-[1120px]">
        Shop by Categories
      </div>
      <div className="flex flex-wrap gap-6 items-start mt-12 max-md:mt-10 max-md:max-w-full">
        <div className="flex flex-col w-[167px]">
          <div className="flex overflow-hidden flex-col max-w-full rounded-[400px] w-[167px]">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/68b0800e54ef188a1a5fb003920e3a9a28bd957e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
              className="object-contain w-full aspect-square"
            />
          </div>
          <div className="mt-3 w-full text-sm font-semibold leading-loose text-center whitespace-nowrap text-neutral-900">
            Puffers
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopByCategories;
