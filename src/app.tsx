import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import LoginPage from './pages/login-page'
import { RequireAuth } from './providers/require-auth'
import { Layout } from '@/components/layout/layout'
import { routes } from '@/config/routes'
import ErrorPage from '@/pages/error-page'
import HomePage from '@/pages/home-page'

export const App = () => {
    const router = createBrowserRouter([
        {
            path: routes.home,
            element: <Layout />,
            errorElement: <ErrorPage />,
            children: [
                {
                    index: true,
                    element: (
                        <RequireAuth>
                            <HomePage />
                        </RequireAuth>
                    )
                },
                {
                    element: <LoginPage />,
                    path: routes.login
                }
            ]
        },
        {
            path: '*',
            element: <ErrorPage />
        }
    ])

    return <RouterProvider router={router} />
}
