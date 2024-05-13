import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type {
    EventDataToRemove,
    EventItemToAdd,
    EventItemToPatch,
    EventResponse,
    SingleEventResponse
} from '@/types/google-events'

const baseQuery = fetchBaseQuery({
    prepareHeaders: (headers) => {
        const sessionFromLocalStorage = localStorage.getItem('accessGoogleToken')

        const session = JSON.parse(sessionFromLocalStorage || '{}')

        if (session?.accessToken && session?.accessToken !== null) {
            headers.set('authorization', `Bearer ${session?.accessToken}`)
        }
        return headers
    }
})

export const googleApi = createApi({
    reducerPath: 'googleApi',
    baseQuery,
    endpoints: (build) => ({
        getGoogleEvents: build.query<EventResponse, string>({
            query: (calendarId) =>
                `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
            providesTags: ['GoogleEvents']
        }),
        addGoogleEvent: build.mutation<SingleEventResponse, EventItemToAdd>({
            query: (body) => ({
                url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                method: 'POST',
                body
            }),
            invalidatesTags: ['GoogleEvents']
        }),
        patchGoogleEvent: build.mutation<SingleEventResponse, EventItemToPatch>({
            query: ({ eventId, calendarId, ...body }) => ({
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['GoogleEvents']
        }),
        removeGoogleEvent: build.mutation<void, EventDataToRemove>({
            query: ({ eventId, calendarId }) => ({
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['GoogleEvents']
        })
    }),
    tagTypes: ['GoogleEvents']
})

export const {
    useGetGoogleEventsQuery,
    useAddGoogleEventMutation,
    usePatchGoogleEventMutation,
    useRemoveGoogleEventMutation
} = googleApi
