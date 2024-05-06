import { api } from '.'

import type {
    EventDataToRemove,
    EventItemToAdd,
    EventItemToPatch,
    EventResponse,
    SingleEventResponse
} from '@/types/google-events'

export const google = api.injectEndpoints({
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
    })
})

export const {
    useGetGoogleEventsQuery,
    useAddGoogleEventMutation,
    usePatchGoogleEventMutation,
    useRemoveGoogleEventMutation
} = google
