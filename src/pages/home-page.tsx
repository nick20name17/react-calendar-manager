import { useSession, useSessionContext } from '@supabase/auth-helpers-react'

import { Login } from '@/components/auth/login'
import { Calendar } from '@/components/home/calendar'

const HomePage = () => {
    const session = useSession()

    const { isLoading } = useSessionContext()

    if (isLoading) return

    return session ? <Calendar /> : <Login />
}

export default HomePage
