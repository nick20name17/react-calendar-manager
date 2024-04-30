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
        getEvents: build.query<EventResponse, string>({
            query: (calendarId) =>
                `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
            providesTags: ['GoogleEvents']
        }),
        addEvent: build.mutation<SingleEventResponse, EventItemToAdd>({
            query: (body) => ({
                url: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                method: 'POST',
                body
            }),
            invalidatesTags: ['GoogleEvents']
        }),
        patchEvent: build.mutation<SingleEventResponse, EventItemToPatch>({
            query: ({ eventId, calendarId, ...body }) => ({
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: ['GoogleEvents']
        }),
        removeEvent: build.mutation<void, EventDataToRemove>({
            query: ({ eventId, calendarId }) => ({
                url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['GoogleEvents']
        })
    })
})

export const {
    useGetEventsQuery,
    useAddEventMutation,
    usePatchEventMutation,
    useRemoveEventMutation
} = google
