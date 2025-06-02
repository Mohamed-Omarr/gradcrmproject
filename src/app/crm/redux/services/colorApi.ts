import {  axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    colors:Colors[],
    message:string
}

export const colorApi = createApi({
    reducerPath: 'colorApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes:["item"],
    endpoints: (build) => ({
        getColor: build.query<incomingGetData,void>({
            query: () => ({
                url:'product/attributes/colorsMethods',
                method:'GET'
            }),
            providesTags: ["item"],
        }),
        createColor: build.mutation({
            query: (followingItem) => ({
                url:'product/attributes/colorsMethods',
                method: 'POST',
                data:followingItem,
            }),
            invalidatesTags: ["item"]
        }),
        deleteColor: build.mutation({
            query: (itemData) => ({
                url:'product/attributes/colorsMethods',
                method: 'DELETE',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        }),
        updateColor: build.mutation({
            query: (itemData) => ({
                url:'product/attributes/colorsMethods',
                method: 'PATCH',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        })
    })
})

export const { useGetColorQuery , useCreateColorMutation , useDeleteColorMutation , useUpdateColorMutation} = colorApi;