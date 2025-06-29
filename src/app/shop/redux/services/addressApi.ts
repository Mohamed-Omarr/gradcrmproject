import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    all_Address:Address[],
    message:string
}

export const addressApi = createApi({
    reducerPath: 'addressApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getAddress: build.query<incomingGetData,void>({
            query: () => ({
                url:'address/addressMethods',
                method:'GET'
            }),
        }),
        addAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
        updateAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'PATCH',
                data:followingItem,
            }),
        }),
        deleteAddress: build.mutation({
            query: (followingItem) => ({
                url:'address/addressMethods',
                method:'DELETE',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetAddressQuery , useAddAddressMutation ,useUpdateAddressMutation ,useDeleteAddressMutation } = addressApi;