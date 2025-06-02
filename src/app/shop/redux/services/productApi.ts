import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    products:ShopProduct[],
    message:string
}

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getProducts: build.query<incomingGetData,void>({
            query: () => ({
                url:'product/allProducts',
                method:'GET'
            }),
        }),
    })
})

export const { useGetProductsQuery } = productApi;