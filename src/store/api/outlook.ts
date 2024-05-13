import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
    OutlookEventItem,
    OutlookEventItemToAdd,
    OutlookEventItemToPatch,
    OutlookEventResponse
} from '@/types/outlook-events'

const baseQuery = fetchBaseQuery({
    prepareHeaders: (headers) => {
        const sessionFromLocalStorage = localStorage.getItem('accessOutlookToken')

        const session = JSON.parse(sessionFromLocalStorage || '{}')

        if (session?.accessToken && session?.accessToken !== null) {
            headers.set('authorization', `Bearer ${session?.accessToken}`)
        }
        return headers
    }
})

export const outlookApi = createApi({
    reducerPath: 'outlookApi',
    baseQuery,
    endpoints: (build) => ({
        getOutlookEvents: build.query<OutlookEventResponse, void>({
            query: () => `https://graph.microsoft.com/v1.0/me/calendar/events/`,
            providesTags: ['OutlookEvents']
        }),
        addOutlookEvent: build.mutation<OutlookEventItem, OutlookEventItemToAdd>({
            query: (body) => ({
                url: 'https://graph.microsoft.com/v1.0/me/calendar/events/',
                method: 'POST',
                body
            }),
            invalidatesTags: ['OutlookEvents']
        }),
        patchOutlookEvent: build.mutation<OutlookEventItem, OutlookEventItemToPatch>({
            query: ({ id, ...body }) => ({
                url: `https://graph.microsoft.com/v1.0/me/calendar/events/${id}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['OutlookEvents']
        }),
        removeOutlookEvent: build.mutation<void, string>({
            query: (id) => ({
                url: `https://graph.microsoft.com/v1.0/me/calendar/events/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['OutlookEvents']
        })
    }),
    tagTypes: ['OutlookEvents']
})

export const {
    useGetOutlookEventsQuery,
    useAddOutlookEventMutation,
    usePatchOutlookEventMutation,
    useRemoveOutlookEventMutation
} = outlookApi
