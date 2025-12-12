import { axiosBaseQueryShop } from "@/lib/axios/axiosBaseQueryShop";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    cart:Cart,
    message:string
}

export const cartApi = createApi({
    reducerPath: 'cartApi',
    baseQuery: axiosBaseQueryShop(),
    tagTypes: ['Cart'],
    endpoints: (build) => ({
        getCartItems: build.query<incomingGetData,void>({
            query: () => ({
                url:'cart/cartMethods',
                method:'GET'
            }),
            providesTags: ['Cart'],
        }),
        addToCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'POST',
                data:followingItem,
            }),
        }),
        updateCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'PATCH',
                data:followingItem,
            }),
            invalidatesTags: ['Cart'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // update cache before api response
                const patchResult = dispatch(
                    cartApi.util.updateQueryData(
                        'getCartItems',
                        undefined,
                        (draft) => {
                            const item = draft.cart.items.find(item => item.id === arg.id);
                            if (item) {
                                item.quantity = arg.quantity;
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    // Roll back in case of error
                    patchResult.undo();
                }
            },
        }),
        deleteFromCartItems: build.mutation({
            query: (followingItem) => ({
                url:'cart/cartItemsMethods',
                method:'DELETE',
                data:followingItem,
            }),
            invalidatesTags: ['Cart'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // update cache before api response
                const patchResult = dispatch(
                    cartApi.util.updateQueryData(
                        'getCartItems',
                        undefined,
                        (draft) => {
                            draft.cart.items = draft.cart.items.filter(item => item.id !== arg.id);
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    // Roll back in case of error
                    patchResult.undo();
                }
            },
        }),
    })
})

export const { useGetCartItemsQuery , useAddToCartItemsMutation ,useUpdateCartItemsMutation ,useDeleteFromCartItemsMutation } = cartApi;