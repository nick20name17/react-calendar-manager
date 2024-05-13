import { getAuth } from 'firebase/auth'
import { lazy, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Head } from '@/components/head'

const ErrorPage = lazy(() => import('@/pages/error-page'))

export const Layout = () => {
    useEffect(() => {
        const auth = getAuth()

        auth?.currentUser?.getIdToken().then(function (idToken) {
            localStorage.setItem(
                'accessGoogleToken',
                JSON.stringify({
                    accessToken: idToken,
                    user: auth.currentUser
                })
            )
        })
    }, [])

    return (
        <>
            <Head />
            <main>
                <ErrorBoundary fallback={<ErrorPage message='Something went wrong' />}>
                    <div className='px-4'>
                        <Outlet />
                    </div>
                </ErrorBoundary>
            </main>
            <Toaster richColors duration={7000} />
        </>
    )
}
