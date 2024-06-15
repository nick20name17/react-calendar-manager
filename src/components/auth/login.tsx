import { GoogleAuthProvider, OAuthProvider, signInWithPopup } from 'firebase/auth'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import googleIcon from '@/assets/img/google.webp'
import outlookIcon from '@/assets/img/microsoft.png'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { auth } from '@/config'
import { routes } from '@/config/routes'

// export const Login = () => {
//     const supabase = useSupabaseClient()

//     const googleSignIn = async () => {
//         await supabase.auth.signInWithOAuth({
//             provider: 'google',
//             options: {
//                 scopes: 'https://www.googleapis.com/auth/calendar'
//             }
//         })
//     }

//     const azureSignIn = async () => {
//         await supabase.auth.signInWithOAuth({
//             provider: 'azure',
//             options: {
//                 scopes: 'Calendars.ReadWrite'
//             }
//         })
//     }

//     return (
//         <Card className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm'>
//             <CardHeader>
//                 <CardTitle className='text-xl'>Sign Up</CardTitle>
//                 <CardDescription>
//                     Sign In with one of the following providers
//                 </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <div className='flex flex-col gap-y-2'>
//                     <Button className='w-full' onClick={() => googleSignIn()}>
//                         Sign In with Google
//                     </Button>
//                     <Button className='w-full' onClick={() => azureSignIn()}>
//                         Sign In with Azure
//                     </Button>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }

export const Login = () => {
    const navigate = useNavigate()

    const provider = new GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/calendar')

    const outlookProvider = new OAuthProvider('microsoft.com')

    const handleAuthGoogle = () => {
        signInWithPopup(auth, provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const accessToken = credential?.accessToken

            navigate(routes.home)

            localStorage.setItem(
                'accessGoogleToken',
                JSON.stringify({
                    accessToken,
                    user: result.user
                })
            )
        })
    }

    const handleAuthOutlook = () => {
        signInWithPopup(auth, outlookProvider).then((result) => {
            const credential = OAuthProvider.credentialFromResult(result)
            const accessToken = credential?.accessToken

            navigate(routes.home)

            localStorage.setItem(
                'accessOutlookToken',
                JSON.stringify({
                    accessToken,
                    user: result.user
                })
            )
        })
    }

    const isGoogle = !!localStorage.getItem('accessGoogleToken')
    const isOutlook = !!localStorage.getItem('accessOutlookToken')

    return (
        <>
            {isGoogle || isOutlook ? (
                <Button
                    onClick={() => navigate(-1)}
                    className='fixed top-10 left-10'
                    size='icon'>
                    <ArrowLeft className='w-4 h-4' />
                </Button>
            ) : null}
            <Card className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm'>
                <CardHeader>
                    <CardTitle className='text-xl'>Sign In</CardTitle>
                    <CardDescription>
                        Sign In with one of the following providers
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-y-2'>
                        <Button
                            disabled={isGoogle}
                            className='w-full'
                            onClick={handleAuthGoogle}>
                            <img className='mr-2 h-6 w-6' src={googleIcon} alt='Google' />
                            {isGoogle ? 'You already logged in' : 'Sign In with Google'}
                        </Button>
                        <Button
                            disabled={isOutlook}
                            className='w-full'
                            onClick={handleAuthOutlook}>
                            <img
                                className='mr-2 h-6 w-6'
                                src={outlookIcon}
                                alt='Outlook'
                            />
                            {isOutlook ? 'You already logged in' : 'Sign In with Outlook'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
