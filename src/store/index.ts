import { configureStore } from '@reduxjs/toolkit'

import { googleApi } from './api/google'
import { outlookApi } from './api/outlook'

export const store = configureStore({
    reducer: {
        [outlookApi.reducerPath]: outlookApi.reducer,
        [googleApi.reducerPath]: googleApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(outlookApi.middleware).concat(googleApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
