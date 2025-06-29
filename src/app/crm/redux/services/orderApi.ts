import { axiosBaseQueryCrm } from '@/lib/axios/axiosBaseQueryCRM';
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    orders:Order[],
    message:string
}

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: axiosBaseQueryCrm(),
    endpoints: (build) => ({
        getOrder: build.query<incomingGetData,void>({
            query: () => ({
                url:'order/orderMethods',
                method:'GET'
            }),
        }),
        updateStatusOfOrder: build.mutation({
            query: (followingItem) => ({
                url:'order/orderMethods',
                method:'PATCH',
                data:followingItem,
            }),
        }),
    })
})

export const { useGetOrderQuery , useUpdateStatusOfOrderMutation  } = orderApi;