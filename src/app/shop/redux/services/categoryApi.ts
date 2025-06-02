import { axiosBaseQueryShop } from '@/lib/axios/axiosBaseQueryShop';
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    categories:ShopCategory[],
    message:string
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: axiosBaseQueryShop(),
    endpoints: (build) => ({
        getCategories: build.query<incomingGetData,void>({
            query: () => ({
                url:'category/categoryMethods',
                method:'GET'
            }),
        }),
    })
})

export const { useGetCategoriesQuery } = categoryApi;