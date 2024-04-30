import { api } from '.'

import type { OutlookEventItemToAdd, OutlookEventResponse } from '@/types/outlook-events'

export const google = api.injectEndpoints({
    endpoints: (build) => ({
        getOutlookEvents: build.query<OutlookEventResponse, void>({
            query: () => `https://graph.microsoft.com/v1.0/me/calendar/events/`,
            providesTags: ['OutlookEvents']
        }),
        addOutlookvent: build.mutation<OutlookEventResponse, OutlookEventItemToAdd>({
            query: (body) => ({
                url: 'https://graph.microsoft.com/v1.0/me/calendar/events/',
                method: 'POST',
                body
            }),
            invalidatesTags: ['OutlookEvents']
        })
    })
})

export const { useGetOutlookEventsQuery, useAddOutlookventMutation } = google
