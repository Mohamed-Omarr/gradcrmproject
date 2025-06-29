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
            query: () => ({
                url:'product/rateProductMethods',
                method:'POST'
            }),
        }),
        updateReview: build.mutation({
            query: () => ({
                url:'product/rateProductMethods',
                method:'PATCH'
            }),
        }),
        deleteReview: build.mutation({
            query: () => ({
                url:'product/rateProductMethods',
                method:'DELETE'
            }),
        }),
    })
})

export const { useCreateReviewMutation , useUpdateReviewMutation , useDeleteReviewMutation } = rateApi;