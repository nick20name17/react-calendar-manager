import type { Session } from '@supabase/supabase-js'
import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { routes } from '@/config/routes'

export const RequireAuth: React.FC<PropsWithChildren> = ({ children }) => {
    const location = useLocation()

    const sessionFromLocalStorage = localStorage.getItem(
        'sb-nurjqsmfemjxyvfpaiao-auth-token'
    )

    const session = JSON.parse(sessionFromLocalStorage || '{}') as Session

    if (!session?.access_token) {
        return <Navigate to={routes.home} state={{ from: location }} replace />
    }

    return children
}
