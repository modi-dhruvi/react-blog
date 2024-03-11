import React, { useContext, useEffect, useState } from 'react'
import { auth, provider } from '../common/firebase'
import Constants from '../common/constants'

export const AuthContext = React.createContext()

// export function useAuth() {
//     return useContext(AuthContext)
// }

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [loggedInAs, setLoggedInAs] = useState('')

    function defaultSignInForGuest(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function signUp(email, password) {
        return auth.createUserWithEmailAndPassword(email, password)
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password)
    }

    function logInWithGoogle() {
        return auth.signInWithPopup(provider)
    }

    function logout() {
        return auth.signOut()
    }

    function resetPassword(email) {
        return auth.sendPasswordResetEmail(email)
    }

    function updateEmail(email) {
        currentUser.updateEmail(email)
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoading(false)
            setCurrentUser(user)

            if (!auth.currentUser) {
                defaultSignInForGuest('guestuser@guest.com', 'guestUser')
            }

            if (user?.email?.includes(Constants.Guest)) {
                setLoggedInAs(Constants.Guest)
            }
            else if (user?.email?.includes(Constants.Admin)) {
                setLoggedInAs(Constants.Admin)
            }
            else {
                setLoggedInAs(Constants.User)
            }

            // console.log(user)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        loggedInAs,
        signUp,
        login,
        logInWithGoogle,
        logout,
        resetPassword,
        updateEmail,
        updatePassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}