import { RouterProvider, createBrowserRouter } from 'react-router-dom'

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
                    element: <HomePage />
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
