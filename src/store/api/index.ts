import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Session } from '@supabase/supabase-js'

const baseQuery = fetchBaseQuery({
    prepareHeaders: (headers) => {
        const sessionFromLocalStorage = localStorage.getItem(
            'sb-nurjqsmfemjxyvfpaiao-auth-token'
        )

        const session = JSON.parse(sessionFromLocalStorage || '{}') as Session

        if (session?.provider_token && session?.provider_token !== null) {
            headers.set('authorization', `Bearer ${session?.provider_token}`)
        }
        return headers
    }
})

export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    endpoints: () => ({}),
    tagTypes: ['GoogleEvents', 'OutlookEvents']
})
