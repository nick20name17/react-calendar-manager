import { type Session, useSupabaseClient } from '@supabase/auth-helpers-react'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'

export const Login = () => {
    const supabase = useSupabaseClient()

    const googleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: 'https://www.googleapis.com/auth/calendar'
            }
        })
    }

    // const appleSignIn = async () => {
    //     await supabase.auth.signInWithOAuth({
    //         provider: 'apple'
    //     })
    // }

    const azureSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
                scopes: 'Calendars.ReadWrite'
            }
        })
    }

    supabase.auth.onAuthStateChange((event) => {
        const sessionFromLocalStorage = localStorage.getItem(
            'sb-nurjqsmfemjxyvfpaiao-auth-token'
        )

        const user = JSON.parse(sessionFromLocalStorage || '{}') as Session

        if (event === 'SIGNED_OUT' && user?.refresh_token) {
            supabase.auth.refreshSession({
                refresh_token: user?.refresh_token!
            })
            supabase.auth.startAutoRefresh()
        } else {
            supabase.auth.stopAutoRefresh()
        }
    })

    return (
        <Card className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm'>
            <CardHeader>
                <CardTitle className='text-xl'>Sign Up</CardTitle>
                <CardDescription>
                    Sign In with one of the following providers
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex flex-col gap-y-2'>
                    <Button className='w-full' onClick={() => googleSignIn()}>
                        Sign In with Google
                    </Button>
                    <Button className='w-full' onClick={() => azureSignIn()}>
                        Sign In with Azure
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
