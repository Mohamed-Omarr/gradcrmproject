import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

// type incomingGetData = {
//     products:ShopProduct[],
//     message:string
// }

export const rateApi = createApi({
    reducerPath: 'rateApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        createReview: build.mutation({
            query: (followingItem) => ({
                url:'product/rateProductMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
        updateReview: build.mutation({
            query: (followingItem) => ({
                url:'product/rateProductMethods',
                method:'PATCH',
                data:followingItem,
            }),
        }),
        deleteReview: build.mutation({
            query: (followingItem) => ({
                url:'product/rateProductMethods',
                method:'DELETE',
                data:followingItem,
            }),
        }),
    })
})

export const { useCreateReviewMutation , useUpdateReviewMutation , useDeleteReviewMutation } = rateApi;