import { axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    categories:Category[],
    message:string
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes:["item"],
    endpoints: (build) => ({
        getCategories: build.query<incomingGetData,void>({
            query: () => ({
                url:'category/categoryMethods',
                method:'GET'
            }),
            providesTags: ["item"]
        }),
        createCategory: build.mutation({
            query: (followingItem) => ({
                url:'category/categoryMethods',
                method: 'POST',
                data:followingItem,
            }),
            invalidatesTags: ["item"]
        }),
        deleteCategory: build.mutation({
            query: (itemData) => ({
                url:'category/categoryMethods',
                method: 'DELETE',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        }),
        updateCategory: build.mutation({
            query: (itemData) => ({
                url:'category/categoryMethods',
                method: 'PATCH',
                data:itemData,
            }),
            invalidatesTags: ["item"]
        })
    })
})

export const { useGetCategoriesQuery , useCreateCategoryMutation , useDeleteCategoryMutation , useUpdateCategoryMutation } = categoryApi;