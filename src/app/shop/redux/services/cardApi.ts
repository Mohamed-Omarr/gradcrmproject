import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    all_Card:Card[],
    message:string
}

export const cardApi = createApi({
    reducerPath: 'cardApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getCard: build.query<incomingGetData,void>({
            query: () => ({
                url:'payment/card/cardMethods',
                method:'GET'
            }),
        }),
        addCard: build.mutation({
            query: (followingItem) => ({
                url:'card/cardMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
        updateCard: build.mutation({
            query: (followingItem) => ({
                url:'card/cardMethods',
                method:'PATCH',
                data:followingItem,
            }),
        }),
        deleteCard: build.mutation({
            query: (followingItem) => ({
                url:'card/cardMethods',
                method:'DELETE',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetCardQuery , useAddCardMutation ,useUpdateCardMutation ,useDeleteCardMutation } = cardApi;