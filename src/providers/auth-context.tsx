import {
    type User as FirebaseUser,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    signOut
} from 'firebase/auth'
import {
    type PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

import { auth } from '@/config'

type AuthContextType = {
    googleSignIn: () => void
    logOut: () => void
    user: FirebaseUser | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null)

    const googleSignIn = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    const logOut = () => {
        signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser!)
        })
        return () => {
            unsubscribe()
        }
    }, [])

    const refreshAccessToken = async () => {
        const refreshToken = JSON.parse(localStorage.getItem('accessGoogleToken') || '{}')
            .user.stsTokenManager.refreshToken

        if (!refreshToken) return
        try {
            const response = await fetch(
                'https://securetoken.googleapis.com/v1/token?key=AIzaSyDZri9e6nuYMw4KrVAiUL3ecz605_Zs9DA',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // client_id:
                        //     '948636653373-vgesuvqddsd6au964m4da588s13fc235.apps.googleusercontent.com',
                        // client_secret: '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',
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token'
                    })
                }
            )
            if (!response.ok) {
                throw new Error('Failed to refresh token')
            }
            const data = await response.json()
            console.log(data)
        } catch (error) {
            console.error('Error refreshing access token:', error)
        }
    }

    useEffect(() => {
        // Оновлюємо токен кожну годину
        const interval = setInterval(refreshAccessToken, 300000)

        // Очищаємо інтервал при розмонтаженні компонента
        return () => clearInterval(interval)
    }, [user])

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => useContext(AuthContext)
