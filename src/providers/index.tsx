import { type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

import { AuthContextProvider } from './auth-context'
import { ThemeProvider } from './theme-provider'
import { store } from '@/store'

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <Provider store={store}>
            <AuthContextProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </AuthContextProvider>
        </Provider>
    )
}
