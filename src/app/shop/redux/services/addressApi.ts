import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    all_Address:Address[],
    message:string
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: axiosBaseQueryShop(),
    tagTypes: ['Address'],
    endpoints: (build) => ({
        getAddress: build.query<incomingGetData,void>({
            query: () => ({
                url:'address/addressMethods',
                method:'GET'
            }),
            providesTags: ['Address'],
        }),
        addAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'POST',
                data:followingItem,
            }),
            invalidatesTags: ['Address'],
        }),
        updateAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'PATCH',
                data:followingItem,
            }),
            invalidatesTags: ['Address'],
        }),
        deleteAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'DELETE',
                data:followingItem,
            }),
            invalidatesTags: ['Address'],
        }),
    })
})

export const { useGetAddressQuery , useAddAddressMutation ,useUpdateAddressMutation ,useDeleteAddressMutation } = addressApi;