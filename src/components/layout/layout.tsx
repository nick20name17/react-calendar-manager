import { useSession } from '@supabase/auth-helpers-react'
import { lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

import { Head } from '@/components/head'
import { Header } from '@/components/layout/header'

const ErrorPage = lazy(() => import('@/pages/error-page'))

export const Layout = () => {
    const session = useSession()

    return (
        <>
            <Head />
            <main>
                {session && <Header />}
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
