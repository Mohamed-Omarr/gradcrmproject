import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    user:customerData,
    message:string
}

export const customerInfoApi = createApi({
    reducerPath: 'customerInfoApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getCustomerInfo: build.query<incomingGetData,void>({
            query: () => ({
                url:'auth/customerInfo',
                method:'GET'
            }),
        }),
    })
})

export const { useGetCustomerInfoQuery } = customerInfoApi;