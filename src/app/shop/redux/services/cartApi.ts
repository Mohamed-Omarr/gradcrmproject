import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    cart:Cart,
    message:string
}

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getCartItems: build.query<incomingGetData,void>({
            query: () => ({
                url:'cart/cartMethods',
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
        updateCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'PATCH',
                data:followingItem,
            }),
        }),
        deleteFromCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'DELETE',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetCartItemsQuery , useAddToCartItemsMutation ,useUpdateCartItemsMutation ,useDeleteFromCartItemsMutation } = cartApi;