import { axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    sizes:Sizes[],
    message:string
}

export const sizeApi = createApi({
    reducerPath: 'sizeApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes:["item"],
    endpoints: (build) => ({
        getSize: build.query<incomingGetData,void>({
            query: () => ({
                url:'product/attributes/sizesMethods',
                method:'GET'
            }),
            providesTags: ["item"]
        }),
        createSize: build.mutation({
            query: (followingItem) => ({
                url:'product/attributes/sizesMethods',
                method: 'POST',
                data:followingItem,
            }),
            invalidatesTags: ["item"]
        }),
        deleteSize: build.mutation({
            query: (itemData) => ({
                url:'product/attributes/sizesMethods',
                method: 'DELETE',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        }),
        updateSize: build.mutation({
            query: (itemData) => ({
                url:'product/attributes/sizesMethods',
                method: 'PATCH',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        })
    })
})

export const { useGetSizeQuery , useCreateSizeMutation , useDeleteSizeMutation , useUpdateSizeMutation} = sizeApi;