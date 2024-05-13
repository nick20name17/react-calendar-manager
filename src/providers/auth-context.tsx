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

    return (
        <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => useContext(AuthContext)
