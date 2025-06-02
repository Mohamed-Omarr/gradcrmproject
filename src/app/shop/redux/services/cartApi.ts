import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    cart:[],
    message:string
}

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getCartItems: build.query<incomingGetData,void>({
            query: () => ({
                url:'product/allProducts',
                method:'GET'
            }),
        }),
        addToCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetCartItemsQuery , useAddToCartItemsMutation } = cartApi;