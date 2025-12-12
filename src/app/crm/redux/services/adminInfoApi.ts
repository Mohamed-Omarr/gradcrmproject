import { axiosBaseQueryCrm } from "@/lib/axios/axiosBaseQueryCRM";
import { createApi } from '@reduxjs/toolkit/query/react';

type incomingGetData = {
    user:adminData,
    message:string
}

export const adminInfoApi = createApi({
    reducerPath: 'adminInfoApi',
    baseQuery: axiosBaseQueryCrm(),
    tagTypes: ['AdminInfo'],
    endpoints: (build) => ({
        getAdminInfo: build.query<incomingGetData,void>({
            query: () => ({
                url:'auth/adminInfo',
                method:'GET'
            }),
            providesTags: ['AdminInfo'],
        }),
        updateAdminInfoName: build.mutation({
            query: (followingItem) => ({
                url:'profile/updateAdminName',
                method:'PATCH',
                data:followingItem
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // update cache before api response
                const patchResult = dispatch(
                    adminInfoApi.util.updateQueryData(
                        'getAdminInfo',
                        undefined,
                        (draft) => {
                            if (draft.user) {
                                draft.user.name = arg.newName;
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
            invalidatesTags: ['AdminInfo'],
        }),
        updateAdminInfoEmail: build.mutation({
            query: (followingItem) => ({
                url:'profile/updateAdminEmail',
                method:'PATCH',
                data:followingItem
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminInfoApi.util.updateQueryData(
                        'getAdminInfo',
                        undefined,
                        (draft) => {
                            if (draft.user) {
                                draft.user.email = arg.newEmail;
                            }
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
            invalidatesTags: ['AdminInfo'],
        }),
    })
})

export const { useGetAdminInfoQuery , useUpdateAdminInfoNameMutation , useUpdateAdminInfoEmailMutation } = adminInfoApi;