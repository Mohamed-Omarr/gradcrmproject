import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    wishlistItems:WishlistItems[],
    message:string
}

export const wishlistApi = createApi({
    reducerPath: 'wishlistApi',
    baseQuery: axiosBaseQueryShop(),
    tagTypes: ['Wishlist'],
    endpoints: (build) => ({
        getWishlist: build.query<incomingGetData,void>({
            query: () => ({
                url:'wishlist/wishlistMethods',
                method:'GET',
            }),
            providesTags: ['Wishlist'],
        }),
        addToWishlistItem: build.mutation({
            query: (followingItem) => ({
                url:'wishlist/wishlistMethods',
                method:'POST',
                data:followingItem
            }),
            invalidatesTags: ['Wishlist'],
        }),
        deleteWishlistItem: build.mutation({
            query: (followingItem) => ({
                url:'wishlist/wishlistMethods',
                method:'DELETE',
                data:followingItem
            }),
            invalidatesTags: ['Wishlist'],
        }),
    })
})

export const { useGetWishlistQuery , useAddToWishlistItemMutation , useDeleteWishlistItemMutation } = wishlistApi;