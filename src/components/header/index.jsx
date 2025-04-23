import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext'
import { doSignOut } from '../../firebase/auth'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn, currentUser, loading } = useAuth()
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true)
            await doSignOut()
            // Wait for auth state to update before navigating
            await new Promise(resolve => setTimeout(resolve, 500))
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setIsLoggingOut(false)
        }
    }

    // Prevent rendering until auth state is ready
    if (loading) {
        return null
    }

    return (
        <nav className='flex flex-row gap-x-2 w-full z-20 fixed top-0 left-0 h-12 border-b place-content-center items-center bg-gray-200'>
            {
                userLoggedIn
                    ?
                    <>
                        <button 
                            onClick={handleLogout} 
                            disabled={isLoggingOut}
                            className='text-sm text-blue-600 underline'
                        >
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    </>
                    :
                    <>
                        <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                        <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                    </>
            }
        </nav>
    )
}

export default Header