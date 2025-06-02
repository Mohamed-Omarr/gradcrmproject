import {  axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    products:Product[],
    message:string
}

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes:["item"],
    endpoints: (build) => ({
        getProducts: build.query<incomingGetData,void>({
            query: () => ({
                url:'product/productMethods',
                method:'GET'
            }),
            providesTags: ["item"]
        }),
        createProduct: build.mutation({
            query: (followingItem) => ({
                url:'product/productMethods',
                method: 'POST',
                data:followingItem,
            }),
            invalidatesTags: ["item"]
        }),
        deleteProduct: build.mutation({
            query: (itemData) => ({
                url:'product/productMethods',
                method: 'DELETE',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        }),
        updateProduct: build.mutation({
            query: (itemData) => ({
                url:'product/productMethods',
                method: 'PATCH',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        })
    })
})

export const { useGetProductsQuery , useCreateProductMutation , useDeleteProductMutation , useUpdateProductMutation } = productApi;