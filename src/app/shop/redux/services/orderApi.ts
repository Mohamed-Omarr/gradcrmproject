import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    allOrders:ShopOrder[],
    message:string
}

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getOrder: build.query<incomingGetData,void>({
            query: () => ({
                url:'payment/order/orderMethods',
                method:'GET'
            }),
        }),
        addOrder: build.mutation({
            query: (followingItem) => ({
                url:'payment/order/orderMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetOrderQuery , useAddOrderMutation  } = orderApi;