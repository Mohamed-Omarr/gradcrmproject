import React from "react";

function Footer() {
  return (
    <>
      <div className="flex flex-col px-40 pt-20 pb-8 bg-gray-200 max-md:px-5">
        <div className="flex flex-col w-full max-w-[1120px] max-md:max-w-full">
          <div className="flex flex-wrap gap-8 items-start max-md:max-w-full">
            <div className="flex flex-col items-start min-w-[240px] w-[352px]">
              <div className="max-w-full text-2xl font-medium leading-none text-center text-black w-[105px]">
                <span className="text-neutral-900">.</span>
              </div>
              <div className="flex flex-col mt-8 w-40 max-w-full text-sm leading-loose text-neutral-900">
                <div className="flex flex-col w-full">
                  <div className="flex flex-col w-full">
                    <div></div>
                    <div className="mt-2"></div>
                    <div className="mt-2"></div>
                  </div>
                  <div className="mt-5"></div>
                </div>
              </div>
              <div className="flex gap-6 items-start mt-8">
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d19ff509b365e97aba6720d71c6c948281af0c8?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 w-6 aspect-square"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5eb4881c53eb69315da0358928d2636b6e07d1e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 w-6 aspect-square"
                />
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/1d4737f983b7909bba56b36a94244c9212bc1e16?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 w-6 aspect-square"
                />
              </div>
            </div>
            <div className="flex flex-col w-40 text-neutral-900">
              <div className="text-base font-medium">Page</div>
              <div className="flex flex-col mt-10 text-sm leading-loose w-[84px]">
                <div>Home</div>
                <div className="mt-6">Shop</div>
                <div className="mt-6">Product</div>
                <div className="mt-6">Articles</div>
                <div className="mt-6">Contact Us</div>
              </div>
            </div>
            <div className="flex flex-col w-40 text-neutral-900">
              <div className="text-base font-medium">Info</div>
              <div className="flex flex-col self-start mt-10 text-sm leading-loose">
                <div>Shipping Policy</div>
                <div className="mt-6">Return & Refund</div>
                <div className="mt-6">Support</div>
                <div className="mt-6">FAQs</div>
              </div>
            </div>
            <div className="flex flex-col min-w-[240px] w-[352px]">
              <div className="text-base font-semibold leading-loose text-neutral-900">
                Join Newsletter
              </div>
              <div className="flex flex-col mt-10 w-full max-w-[352px]">
                <div className="text-sm leading-6 text-neutral-900">
                  Subscribe our newsletter to get more deals, new products and
                  promotions
                </div>
                <div className="flex overflow-hidden gap-10 justify-end py-2 pr-2 pl-4 mt-6 w-full rounded-[90px]">
                  <div className="my-auto text-sm leading-loose text-zinc-500">
                    Enter your email
                  </div>
                  <div className="flex gap-2.5 justify-center items-center px-1 w-8 h-8 bg-blue-500 rounded-[100px]">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/6853dc1af7e4c6e487ad9dfb620f1df064882772?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                      className="object-contain self-stretch my-auto w-6 aspect-square"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center py-8 mt-16 w-full border-t border-solid border-t-zinc-500 min-h-[96px] max-md:mt-10 max-md:max-w-full">
            <div className="flex justify-between items-center w-full max-md:max-w-full">
              <div className="flex flex-wrap gap-4 items-start self-stretch my-auto text-xs leading-loose min-w-[240px] text-neutral-900 w-[1120px] max-md:max-w-full">
                <div>Copyright © 2025  All rights reserved</div>
                <div className="flex gap-4 justify-center items-center pl-4 text-right border-l border-solid border-l-zinc-500 border-zinc-500">
                  <div className="self-stretch my-auto">Privacy Policy</div>
                  <div className="self-stretch my-auto">Terms & Conditions</div>
                </div>
              </div>
              <div className="flex gap-2 items-center self-stretch my-auto min-w-[240px] w-[328px]">
                <div className="flex flex-col self-stretch my-auto w-12">
                  <div className="flex shrink-0 h-8 bg-white rounded" />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/0efd08fdf436dd3319fce816185d098b63d4a1c3?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 self-stretch my-auto w-12 aspect-[1.5]"
                />
                <div className="flex flex-col self-stretch my-auto w-12">
                  <div className="flex shrink-0 h-8 bg-white rounded" />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/623b3a321ebaee3c253b06d3f85e4544e5475c4e?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 self-stretch my-auto w-12 aspect-[1.5]"
                />
                <div className="flex flex-col self-stretch my-auto w-12">
                  <div className="flex shrink-0 h-8 bg-white rounded" />
                </div>
                <img
                  loading="lazy"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/2993ef06d28d31353b434247601be7879a57ac86?placeholderIfAbsent=true&apiKey=12ab9d8d2f324604bf4033a7048c5d60"
                  className="object-contain shrink-0 self-stretch my-auto w-12 aspect-[1.5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
