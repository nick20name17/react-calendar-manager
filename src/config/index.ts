import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export const appName = 'Calendar Manager'

export const firebaseConfig = {
    apiKey: 'AIzaSyDZri9e6nuYMw4KrVAiUL3ecz605_Zs9DA',
    authDomain: 'calendarmanager-419020.firebaseapp.com',
    projectId: 'calendarmanager-419020',
    storageBucket: 'calendarmanager-419020.appspot.com',
    messagingSenderId: '948636653373',
    appId: '1:948636653373:web:8c2c0ce8a1618f544a1754'
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
