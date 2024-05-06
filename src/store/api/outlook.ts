import { api } from '.'

import type {
    OutlookEventItem,
    OutlookEventItemToAdd,
    OutlookEventItemToPatch,
    OutlookEventResponse
} from '@/types/outlook-events'

export const google = api.injectEndpoints({
    endpoints: (build) => ({
        getOutlookEvents: build.query<OutlookEventResponse, void>({
            query: () => `https://graph.microsoft.com/v1.0/me/calendar/events/`,
            providesTags: ['OutlookEvents']
        }),
        addOutlookvent: build.mutation<OutlookEventItem, OutlookEventItemToAdd>({
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
    })
})

export const {
    useGetOutlookEventsQuery,
    usePatchOutlookEventMutation,
    useAddOutlookventMutation,
    useRemoveOutlookEventMutation
} = google
