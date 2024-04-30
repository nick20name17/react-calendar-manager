import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { ThemeProvider } from './theme-provider'
import { store } from '@/store'

const supabase = createClient(
    'https://nurjqsmfemjxyvfpaiao.supabase.co/',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51cmpxc21mZW1qeHl2ZnBhaWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMzU1OTksImV4cCI6MjAyOTgxMTU5OX0.-3LG3u9xTsFThgDQ-GitGiqnIxVIyUi1eNLcvuNt3Rs'
)
export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <SessionContextProvider supabaseClient={supabase}>
            <Provider store={store}>
                <ThemeProvider>{children}</ThemeProvider>
            </Provider>
        </SessionContextProvider>
    )
}
