import { axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    stocks: Stock[],
    message:string,
}

export const stockApi = createApi({
    reducerPath: 'stockApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes:["item"],
    endpoints: (build) => ({
        getStocks: build.query<incomingGetData,void>({
            query: () => ({
                url:'stock/stockMethods',
                method:'GET'
            }),
            providesTags: ["item"]
        }),
        createStock: build.mutation({
            query: (followingItem) => ({
                url:'stock/stockMethods',
                method: 'POST',
                data:followingItem,
            }),
            invalidatesTags: ["item"]
        }),
        deleteStock: build.mutation({
            query: (itemData) => ({
                url:'stock/stockMethods',
                method: 'DELETE',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        }),
        updateStock: build.mutation({
            query: (itemData) => ({
                url:'stock/stockMethods',
                method: 'PATCH',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        })
    })
})

export const { useGetStocksQuery , useCreateStockMutation , useDeleteStockMutation , useUpdateStockMutation } = stockApi;