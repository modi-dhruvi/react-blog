import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Constants from '../common/constants'

//wrapper around current route
function PrivateRoute({ children }) {
    const { currentUser, loggedInAs } = useAuth()

    if (!currentUser || loggedInAs.includes(Constants.Guest)) {
        return <Navigate to='/login' />
    }

    return children
}

function CustomPrivateRoute({ children }) {
    const { currentUser, loggedInAs } = useAuth()

    if (!currentUser || !loggedInAs.includes(Constants.Admin)) {
        return <Navigate to='/login' />
    }

    return children
}

export {PrivateRoute, CustomPrivateRoute}
