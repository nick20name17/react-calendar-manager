import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { routes } from '@/config/routes'

export const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation()

    const googleToken = localStorage.getItem('accessGoogleToken')
    const outlookToken = localStorage.getItem('accessOutlookToken')

    if (!googleToken && !outlookToken) {
        return <Navigate to={routes.login} state={{ from: location }} replace />
    }

    return children
}
